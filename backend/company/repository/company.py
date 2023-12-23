from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import aliased

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

    async def get_employees_by_division(self, division_id):
        async with async_session_maker() as session:
            EmployeeAlias = aliased(Employee)

            stmt = select(Employee). \
                join(Assignment, Employee.id == Assignment.employee_id). \
                join(StaffUnit, Assignment.staff_units_id == StaffUnit.id). \
                join(Division, StaffUnit.division_id == Division.id). \
                where(Division.id == division_id)

            result = await session.execute(stmt)

            employees = result.scalars().all()
            return employees


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
