from fastapi import Depends
from sqlalchemy import select

from company.models.db import Employee, StaffUnit, Division, Assignment, Acting, EmployeeStatus
from database import async_session_maker
from utils.repository import SQLALchemyRepository


class EmployeeRepository(SQLALchemyRepository):
    model = Employee

    async def find_user_by_email(self, email: str):
        async with async_session_maker() as session:
            stmt = select(self.model).filter(self.model.email == email)
            result = await session.execute(stmt)
            found_email = result.scalar_one_or_none()
            if found_email:
                return found_email.id
            return None


class EmployeeStatusRepository(SQLALchemyRepository):
    model = EmployeeStatus


class StaffUnitRepository(SQLALchemyRepository):
    model = StaffUnit


class DivisionRepository(SQLALchemyRepository):
    model = Division


class AssignmentRepository(SQLALchemyRepository):
    model = Assignment


class ActingRepository(SQLALchemyRepository):
    model = Acting
