from datetime import datetime
from enum import Enum
from typing import Optional, Dict
from uuid import UUID

from fastapi import APIRouter, UploadFile, Response, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select, literal_column, or_, and_

from auth.models.db import User
from auth.services.users_api import get_employee_info
from auth.utils.user_auth import current_user
from company.models.db import Employee, StaffUnit, Assignment, Division
from company.models.schemas import OrgTree, OrgUnitEmployee, OrgUnit
from company.repository.company import DivisionRepository, EmployeeRepository, StaffUnitRepository, \
    EmployeeStatusRepository, AssignmentRepository
from company.utils.export_org_structure import export_org_structure
from company.utils.import_org_structure import import_org_structure
from config import settings
from database import async_session_maker

org_router = APIRouter(prefix='/org', tags=['org-structure'])


@org_router.post("/structure-upload")
async def structure_upload(file: UploadFile):  # , user: User = Depends(current_user)
    parsed_structure = await import_org_structure(file.file)
    return {
        "filename": file.filename,
        "parsed_structure": parsed_structure
    }


@org_router.get("/structure-export")
async def structure_export():
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
async def get_child(division_id: UUID, user: User = Depends(current_user)):
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


async def get_head_employee_ids(employee_id: UUID):
    async with (async_session_maker() as session):
        try:
            employee = await employee_repository.find_one(employee_id)
        except:
            raise HTTPException(status_code=404, detail={
                'code': 'EMPLOYEE_NOT_FOUND',
                'reason': 'Employee with that id is not found'
            })
        employee_info = await get_employee_info(employee)

        with_recursive_cte = select(Division).where(Division.id == employee_info['division']['id']).cte(
            name="ParentChain", recursive=True)

        recursive_term = select(Division).join(with_recursive_cte,
                                               Division.id == with_recursive_cte.c.parent_division_id)
        with_recursive_cte = with_recursive_cte.union_all(recursive_term)

        stmt = select(with_recursive_cte.c.head_employee_id)

        result = await session.execute(stmt)
        return result.scalars().all()


class SearchOptionEnum(Enum):
    ADMIN = 'ADMIN'
    HEAD_EMPLOYEE = 'HEAD_EMPLOYEE'


@org_router.get('/employee-search')
async def search_employees(term: str = '', limit: int = 5, option: SearchOptionEnum = None, member_id: UUID = None):
    async with async_session_maker() as session:
        filters = []

        search_terms = term.split()

        for term in search_terms:
            filters.append(or_(*[getattr(Employee, field).ilike(f"%{term.strip()}%") for field in
                                 ["name", "surname", "patronymic"]]))

        if option == SearchOptionEnum.ADMIN:
            filters.append(Employee.role_id == 2)

        if option == SearchOptionEnum.HEAD_EMPLOYEE:
            head_employees_ids = await get_head_employee_ids(member_id)
            filters.append(Employee.id.in_(head_employees_ids))

        query = select(Employee).filter(and_(*filters)).limit(limit)
        results = (await session.execute(query)).scalars().all()

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
    name: str
    division_id: UUID


@org_router.patch('/staff-unit')
async def update_staff_unit(request: UpdateStaffUnitSchema):
    try:
        await staff_unit_repository.find_one(request.id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'STAFF_UNIT_NOT_FOUND',
            'reason': 'Staff unit with that id is not found'
        })

    try:
        await division_repository.find_one(request.division_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DIVISION_NOT_FOUND',
            'reason': 'Division with that id is not found'
        })

    staff_units = await staff_unit_repository.find_all({
        'name': request.name,
        'division_id': request.division_id
    }, AND=True)

    if staff_units:
        raise HTTPException(status_code=400, detail={
            'code': 'STAFF_UNIT_ALREADY_EXISTS',
            'reason': 'Staff unit with that name is already exists in division'
        })
    await staff_unit_repository.update_one(record_id=request.id, data={
        'name': request.name,
        'division_id': request.division_id
    })


class DivisionSchema(BaseModel):
    id: UUID
    name: str
    parent_division_id: UUID | None
    head_employee_id: UUID
    status: bool


class StaffUnitInfoSchema(BaseModel):
    id: UUID
    name: str
    division: DivisionSchema


@org_router.get('/staff-unit/{id}')
async def get_staff_unit(id: UUID) -> StaffUnitInfoSchema:
    try:
        staff_unit = await staff_unit_repository.find_one(id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'STAFF_UNIT_NOT_FOUND',
            'reason': 'Staff unit with that id is not found'
        })

    division = await division_repository.find_one(staff_unit.division_id)
    return StaffUnitInfoSchema(
        id=staff_unit.id,
        name=staff_unit.name,
        division=DivisionSchema(
            id=division.id,
            name=division.name,
            parent_division_id=division.parent_division_id,
            head_employee_id=division.head_employee_id,
            status=division.status,
        )
    )


@org_router.get('/staff-unit-search')
async def search_staff_unit(division_id: UUID, term: str, limit: int = 5):
    async with (async_session_maker() as session):
        filters = []

        search_terms = term.split()

        if search_terms:
            for ter in search_terms:
                for_term = []
                for field in ["name"]:
                    for_term.append(getattr(StaffUnit, field).ilike(f"%{ter.strip()}%"))
                filters.append(or_(*for_term))
        if not filters:
            raise HTTPException(status_code=400, detail="Invalid search terms")
        filters.append(StaffUnit.division_id == division_id)
        results = await session.execute(select(StaffUnit).filter(and_(*filters)).limit(limit))
        results = results.scalars().all()

        results = [await get_staff_unit(result.id) for result in results]

        if not results:
            raise HTTPException(status_code=404, detail="No results found")

    return results


@org_router.get('/staff-unit/all/{division_id}')
async def get_all_staff_unit(division_id: UUID):
    async with (async_session_maker() as session):
        results = await session.execute(select(StaffUnit).filter(StaffUnit.division_id == division_id))
        results = results.scalars().all()
        results = [await get_staff_unit(result.id) for result in results]

        if not results:
            raise HTTPException(status_code=404, detail="No results found")

    return results


class CreateDivisionSchema(BaseModel):
    name: str
    parent_division_id: UUID
    head_employee_id: UUID = None
    status: bool


@org_router.post('/division')
async def create_division(request: CreateDivisionSchema):
    try:
        parent_division_id = await division_repository.find_one(request.parent_division_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'PARENT_DIVISION_NOT_FOUND',
            'reason': 'Parent division with that id is not found'
        })

    if request.head_employee_id is not None:
        try:
            head_employee_id = await employee_repository.find_one(request.head_employee_id)
        except:
            raise HTTPException(status_code=404, detail={
                'code': 'HEAD_EMPLOYEE_NOT_FOUND',
                'reason': 'Head employee with that id is not found'
            })

    divisions = await division_repository.find_all({
        'name': request.name,
        'parent_division_id': request.parent_division_id}, AND=True)

    if divisions:
        raise HTTPException(status_code=400, detail={
            'code': 'DIVISION_ALREADY_EXISTS',
            'reason': 'Division with that name is already exists in division'
        })

    await division_repository.add_one({
        'name': request.name,
        'parent_division_id': request.parent_division_id,
        'head_employee_id': request.head_employee_id,
        'status': request.status
    })


@org_router.delete('/division')
async def delete_division(division_id: UUID):
    try:
        await division_repository.find_one(division_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DIVISION_NOT_FOUND',
            'reason': 'Division with that id is not found'
        })
    await division_repository.delete_one(division_id)


class UpdateDivisionSchema(BaseModel):
    id: UUID
    name: str
    parent_division_id: UUID
    head_employee_id: UUID
    status: bool


@org_router.patch('/division')
async def update_division(request: UpdateDivisionSchema):
    try:
        await division_repository.find_one(request.id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DIVISION_NOT_FOUND',
            'reason': 'Division with that id is not found'
        })

    try:
        await division_repository.find_one(request.parent_division_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'PARENT_DIVISION_NOT_FOUND',
            'reason': 'Parent division with that id is not found'
        })

    try:
        head_employee_id = await employee_repository.find_one(request.head_employee_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'HEAD_EMPLOYEE_NOT_FOUND',
            'reason': 'Head employee with that id is not found'
        })

    if request.id == request.parent_division_id:
        raise HTTPException(status_code=400, detail={
            'code': 'INVALID_PARENT_DIVISION',
            'reason': 'Parent division is same that current division'
        })

    divisions = await division_repository.find_all({
        'name': request.name,
        'parent_division_id': request.parent_division_id}, AND=True)

    if divisions:
        raise HTTPException(status_code=400, detail={
            'code': 'DIVISION_ALREADY_EXISTS',
            'reason': 'Division with that name is already exists in division'
        })

    await division_repository.update_one(record_id=request.id, data={
        'name': request.name,
        'parent_division_id': request.parent_division_id,
        'head_employee_id': request.head_employee_id,
        'status': request.status,
    })


# class DivisionInfoSchema(BaseModel):
#     id: UUID
#     name: str
#     status: bool
#     parent_division: UUID
#     head_employee: dict
#
#     class Config:
#         arbitrary_types_allowed = True


@org_router.get('/division/{id}')
async def get_division(id: UUID):
    try:
        division = await division_repository.find_one(id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DIVISION_NOT_FOUND',
            'reason': 'Division with that id is not found'
        })
    try:
        if division.parent_division_id:
            parent_division = await division_repository.find_one(division.parent_division_id)
        else:
            parent_division = None
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'PARENT_DIVISION_NOT_FOUND',
            'reason': 'Parent division for division with that id is not found'
        })
    if division.head_employee_id:
        head_employee = await get_employee_info(await employee_repository.find_one(division.head_employee_id))
    else:
        head_employee = None

    return {
        'id': division.id,
        'name': division.name,
        'status': division.status,
        'parent_division': parent_division,
        'head_employee': head_employee
    }
    # return DivisionInfoSchema(
    #     id=division.id,
    #     name=division.name,
    #     status=division.status,
    #     parent_division=division.parent_division_id,
    #     head_employee=head,
    # )


@org_router.get('/division-search')
async def search_division(term: str, limit: int = 5):
    async with (async_session_maker() as session):
        filters = []

        search_terms = term.split()

        if search_terms:
            for ter in search_terms:
                for_term = []
                for field in ["name"]:
                    for_term.append(getattr(Division, field).ilike(f"%{ter.strip()}%"))
                filters.append(or_(*for_term))
        if not filters:
            raise HTTPException(status_code=400, detail="Invalid search terms")

        results = await session.execute(select(Division).filter(and_(*filters)).limit(limit))
        results = results.scalars().all()

        results = [await get_division(result.id) for result in results]

        if not results:
            raise HTTPException(status_code=404, detail="No results found")

    return results
