from sqlalchemy.exc import NoResultFound

from docs.models.db import Document, Course, CourseTemplate, CourseMember, DocumentCommand
from sqlalchemy import select, delete, and_

from database import async_session_maker
from utils.repository import SQLALchemyRepository


class DocumentRepository(SQLALchemyRepository):
    model = Document



class CourseRepository(SQLALchemyRepository):
    model = Course


class CourseTemplateRepository(SQLALchemyRepository):
    model = CourseTemplate

    async def find_title(self, title: str):
        async with async_session_maker() as session:
            query = select(self.model).where(self.model.title == title)
            result = await session.execute(query)
            return result

class MemberCourseRepository(SQLALchemyRepository):
    model = CourseMember

    async def delete_link(self, course_id:int):
        async with async_session_maker() as session:
            stmt = delete(self.model).where(self.model.course_id == course_id)
            result = await session.execute(stmt)
            await session.commit()
            return result.rowcount



class DocumentCommandRepository(SQLALchemyRepository):
    model = DocumentCommand

    async def delete_one_with_conditions(self, conditions: dict = None):
        async with async_session_maker() as session:
            query = delete(self.model)
            filters = []
            for key, value in conditions.items():
                filters.append(getattr(self.model, key).__eq__(value))

            query = query.where(and_(*filters))
            execute_result = await session.execute(query)
            await session.commit()

    async def delete_all(self, conditions: dict = None):
        async with async_session_maker() as session:
            query = delete(self.model)
            filters = []
            for key, value in conditions.items():
                filters.append(getattr(self.model, key).__eq__(value))

            query = query.where(and_(*filters))
            execute_result = await session.execute(query)
            await session.commit()