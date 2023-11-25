from fastapi import Depends
from sqlalchemy import select

from company.models.db import Employee, StaffUnit, Division, Assignment, Acting
from database import get_async_session
from utils.repository import SQLALchemyRepository


class EmployeeRepository(SQLALchemyRepository):
    model = Employee

    async def find_user_by_email(self, email: str):
        stmt = select(self).filter(self.email == email)
        result = await self.session.execute(stmt)
        found_email = result.scalar_one_or_none()
        if found_email:
            return found_email.email
        return None


class StaffUnitRepository(SQLALchemyRepository):
    model = StaffUnit


class DivisionRepository(SQLALchemyRepository):
    model = Division


class AssignmentRepository(SQLALchemyRepository):
    model = Assignment


class ActingRepository(SQLALchemyRepository):
    model = Acting
