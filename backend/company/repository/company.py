from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from company.models.db import Employee
from database import get_async_session
from utils.repository import SQLALchemyRepository


class EmployeeRepository(SQLALchemyRepository):
    model = Employee


async def get_employee_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, Employee)
