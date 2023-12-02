from fastapi import APIRouter, UploadFile, Response, Depends, HTTPException
from sqlalchemy import select

from auth.models.db import User
from auth.utils.user_auth import current_user
from company.models.db import Employee, StaffUnit, Assignment
from company.models.schemas import OrgTree, OrgUnitEmployee, OrgUnit
from company.repository.company import DivisionRepository, EmployeeRepository, StaffUnitRepository
from company.utils.export_org_structure import export_org_structure
from company.utils.import_org_structure import import_org_structure
from database import async_session_maker

org_router = APIRouter(prefix='/org', tags=['org-structure'])


@org_router.post("/structure-upload")
async def structure_upload(file: UploadFile, user: User = Depends(current_user)):
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


@org_router.post("/get_child")
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
