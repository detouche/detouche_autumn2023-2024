from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, UploadFile, Response, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select, literal_column, or_, and_

from auth.models.db import User
from auth.services.users_api import get_employee_info
from auth.utils.user_auth import current_user
from company.models.db import Employee, StaffUnit, Assignment
from company.models.schemas import OrgTree, OrgUnitEmployee, OrgUnit
from company.repository.company import DivisionRepository, EmployeeRepository, StaffUnitRepository, \
    EmployeeStatusRepository, AssignmentRepository
from company.utils.export_org_structure import export_org_structure
from company.utils.import_org_structure import import_org_structure
from config import settings
from database import async_session_maker

org_router = APIRouter(prefix='/org', tags=['org-structure'])


@org_router.post("/structure-upload")
async def structure_upload(file: UploadFile): #, user: User = Depends(current_user)
    parsed_structure = await import_org_structure(file.file)
    return {
        "filename": file.filename,
        "parsed_structure": parsed_structure
    }


@org_router.get("/structure-export")
async def structure_export(user: User = Depends(current_user)):
    buffer = await export_org_structure()
    return Response(buffer.getvalue(),
                    media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={'Content-Disposition': 'attachment; filename="filename.xlsx"'})


division_repository = DivisionRepository()
employee_repository = EmployeeRepository()
staff_unit_repository = StaffUnitRepository()


@org_router.get("/get-tree")
async def get_tree(user: User = Depends(current_user)):
    head_division = await division_repository.find_all({'parent_division_id': None})
    if len(head_division) != 1:
        raise HTTPException(status_code=400, detail={
            'code': 'ORG_STRUCTURE_GET_DIVISIONS_ERROR',
            'reason': 'Org Structure has not or has more than one head divisions',
        })
    head_children_division = await division_repository.find_all({'parent_division_id': head_division[0].id})
    children_list = []
    for child in head_children_division:
        children_list.append(child.__dict__)
    return OrgTree(
        id=head_division[0].id,
        title=head_division[0].name,
        status=head_division[0].status,
        children=children_list
    )


@org_router.post("/get-child")
async def get_child(division_id: int, user: User = Depends(current_user)):
    try:
        division = await division_repository.find_one(division_id)
    except:
        raise HTTPException(status_code=400, detail={
            'code': 'DIVISION_IS_NOT_EXISTS',
            'reason': 'Division with that id is not exists',
        })
    children_division = await division_repository.find_all({'parent_division_id': division_id})
    children_list = []
    if children_division:
        for child in children_division:
            children_list.append(child.__dict__)

    async with (async_session_maker() as session):
        employees = select(Employee, StaffUnit
                           ).join(Assignment, Employee.id == Assignment.employee_id
                                  ).join(StaffUnit, Assignment.staff_units_id == StaffUnit.id
                                         ).filter(StaffUnit.division_id == division_id)

        execute_result = await session.execute(employees)
        data = execute_result.mappings().all()
        org_units_employee = []
        for employee in data:
            org_units_employee.append(OrgUnitEmployee(
                id=employee.Employee.id,
                email=employee.Employee.email,
                name=employee.Employee.name,
                surname=employee.Employee.surname,
                patronymic=employee.Employee.patronymic,
                staff_unit=employee.StaffUnit,
            ))

    return OrgUnit(
        id=division_id,
        name=division.name,
        status=division.status,
        children=children_list,
        employees=org_units_employee
    )


class EmployeeSchema(BaseModel):
    email: EmailStr
    name: str
    surname: str
    patronymic: str
    role_id: int = 1
    employee_status_id: int

class AssignmentSchema(BaseModel):
    start_date: datetime = Field(default_factory=datetime.now)
    end_date: datetime = Field(default_factory=datetime.now)

class StaffUnitSchema(BaseModel):
    id: UUID

class CreateEmployeeSchema(BaseModel):
    employee: EmployeeSchema
    assignment: AssignmentSchema
    staff_unit: StaffUnitSchema

assignment_repository = AssignmentRepository()

@org_router.post('/employee')
async def create_employee(request: CreateEmployeeSchema):
    if request.employee.email.split('@')[1] not in settings.ALLOWED_DOMAINS:
        raise HTTPException(status_code=400, detail={
            'code': 'WRONG_EMAIL_DOMAIN',
            'reason': "This email domain is not allowed for organization"
        })

    employee_statuses = await EmployeeStatusRepository().find_all()
    if request.employee.employee_status_id not in [status.id for status in employee_statuses]:
        raise HTTPException(status_code=400, detail={
            'code': 'WRONG_EMPLOYEE_STATUS',
            'reason': 'This employee status is not exists'
        })

    employees = await employee_repository.find_user_by_email(request.employee.email)
    if employees is not None:
        raise HTTPException(status_code=400, detail={
            'code': 'EMPLOYEE_EMAIL_IS_ALREADY_EXISTS',
            'reason': 'Employee with that email is already exists'
        })

    try:
        await staff_unit_repository.find_one(request.staff_unit.id)
    except:
        raise HTTPException(status_code=400, detail={
            'code': 'STAFF_UNIT_DOES_NOT_EXISTS',
            'reason': 'Staff unit with that id is not exists'
        })

    new_employee_id = await employee_repository.add_one(request.employee.model_dump())

    await assignment_repository.add_one({
        'start_date': request.assignment.start_date,
        'end_date': request.assignment.end_date,
        'employee_id': new_employee_id,
        'staff_units_id': request.staff_unit.id,
        'is_acting': False,
    })




@org_router.delete('/employee')
async def delete_employee(employee_id: UUID):
    try:
        await employee_repository.find_one(employee_id)
    except:
        raise HTTPException(status_code=400, detail={
            'code': 'EMPLOYEE_NOT_FOUND',
            'reason': 'Employee with that id is not found'
        })
    await employee_repository.delete_one(employee_id)



class UpdateEmployeeSchema(BaseModel):
    employee_id: UUID
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    employee_status_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    staff_units_id: Optional[UUID] = None


@org_router.patch('/employee')
async def update_employee(request: UpdateEmployeeSchema):
    try:
        await employee_repository.find_one(request.employee_id)
    except:
        raise HTTPException(status_code=400, detail={
            'code': 'EMPLOYEE_NOT_FOUND',
            'reason': 'Employee with that id is not found'
        })

    if request.email and request.email.split('@')[1] not in settings.ALLOWED_DOMAINS:
        raise HTTPException(status_code=400, detail={
            'code': 'WRONG_EMAIL_DOMAIN',
            'reason': "This email domain is not allowed for organization"
        })

    if request.staff_units_id:
        try:
            await staff_unit_repository.find_one(request.staff_units_id)
        except:
            raise HTTPException(status_code=400, detail={
                'code': 'STAFF_UNIT_NOT_FOUND',
                'reason': 'Staff unit with that id is not found'
            })

    if request.employee_status_id:
        try:
            await EmployeeStatusRepository().find_one(request.employee_status_id)
        except:
            raise HTTPException(status_code=400, detail={
                'code': 'EMPLOYEE_STATUS_NOT_FOUND',
                'reason': 'Employee status with that id is not found'
            })

    if any([request.email, request.name, request.surname, request.patronymic, request.employee_status_id]):
        data = {}
        if request.email:
            data['email'] = request.email
        if request.name:
            data['name'] = request.name
        if request.surname:
            data['surname'] = request.surname
        if request.patronymic:
            data['patronymic'] = request.patronymic
        if request.employee_status_id:
            data['employee_status_id'] = request.employee_status_id
        await employee_repository.update_one(record_id=request.employee_id, data=data)

    if any([request.start_date, request.end_date, request.staff_units_id]):
        data = {}
        if request.start_date:
            data['start_date'] = request.start_date
        if request.end_date:
            data['end_date'] = request.end_date
        if request.staff_units_id:
            data['staff_units_id'] = request.staff_units_id
        assignment = await assignment_repository.find_all({'employee_id': request.employee_id})
        await assignment_repository.update_one(record_id=assignment[0].id, data=data)

    return request


@org_router.get('/employee/{id}')
async def get_employee(id: UUID):
    try:
        employee = await employee_repository.find_one(id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'EMPLOYEE_NOT_FOUND',
            'reason': 'Employee with that id is not found'
        })
    return await get_employee_info(employee)



@org_router.get('/employee-search/{term}')
async def search_employees(term: str, limit: int = 5):
    async with (async_session_maker() as session):
        filters = []

        search_terms = term.split()

        if search_terms:
            for ter in search_terms:
                for_term = []
                for field in ["name", "surname", "patronymic"]:
                    for_term.append(getattr(Employee, field).ilike(f"%{ter.strip()}%"))
                filters.append(or_(*for_term))
        if not filters:
            raise HTTPException(status_code=400, detail="Invalid search terms")
        results = await session.execute(select(Employee).filter(and_(*filters)).limit(limit))
        results = results.scalars().all()

        results = [await get_employee_info(result) for result in results]

        if not results:
            raise HTTPException(status_code=404, detail="No results found")

    return results


class CreateStaffUnitSchema(BaseModel):
    division_id: UUID
    staff_unit_name: str


@org_router.post('/staff-unit')
async def create_staff_unit(request: CreateStaffUnitSchema):
    try:
        division = await division_repository.find_one(request.division_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DIVISION_NOT_FOUND',
            'reason': 'Division with that id is not found'
        })

    staff_units = await staff_unit_repository.find_all({
        'name': request.staff_unit_name,
        'division_id': request.division_id},
        AND=True)

    if staff_units:
        raise HTTPException(status_code=400, detail={
            'code': 'STAFF_UNIT_ALREADY_EXISTS',
            'reason': 'Staff unit with that name is already exists in division'
        })

    await staff_unit_repository.add_one({'name': request.staff_unit_name, 'division_id': request.division_id})


@org_router.delete('/staff-unit')
async def delete_staff_unit(staff_unit_id: UUID):
    try:
        await staff_unit_repository.find_one(staff_unit_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'STAFF_UNIT_NOT_FOUND',
            'reason': 'Staff unit with that id is not found'
        })
    await staff_unit_repository.delete_one(staff_unit_id)


class UpdateStaffUnitSchema(BaseModel):
    id: UUID
    name: str = None
    division_id: UUID = None



