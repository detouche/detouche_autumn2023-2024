from sqlalchemy import select

from company.models.db import Employee, StaffUnit, Division, StaffUnit_Division, Assignment, Acting
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


class StaffUnit_DivisionRepository(SQLALchemyRepository):
    model = StaffUnit_Division


class AssignmentRepository(SQLALchemyRepository):
    model = Assignment


class ActingRepository(SQLALchemyRepository):
    model = Acting
