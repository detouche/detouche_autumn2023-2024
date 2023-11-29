from fastapi import APIRouter, Depends, HTTPException

from auth.models.db import User
from auth.services.users_api import get_employee_info
from auth.utils.user_auth import current_user
from company.repository.company import EmployeeRepository, DivisionRepository

heads_definer_router = APIRouter(prefix='/docs', tags=['course-application'])
employee_repository = EmployeeRepository()

async def get_admin():
    return await employee_repository.find_all({'role_id': 2})


division_repository = DivisionRepository()


@heads_definer_router.get("/define-heads")
async def get_heads_for_user(employee_id: int, user: User = Depends(current_user)):
    try:
        employee = await employee_repository.find_one(employee_id)
    except Exception:
        raise HTTPException(status_code=404, detail={
            "code": "EMPLOYEE_NOT_FOUND",
            "reason": "This employee is not exists",
        })

    employee_info = await get_employee_info(employee)
    manager = await employee_repository.find_one(employee_info['division']['head_employee'].id)
    director_division = await division_repository.find_one(employee_info['division']['parent_division'])
    director = await employee_repository.find_one(director_division.head_employee_id)
    admin = await get_admin()

    return {
        'manager': await get_employee_info(manager),
        'director': await get_employee_info(director),
        'admin': await get_employee_info(admin[0]),
    }