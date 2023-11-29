from sqlalchemy.exc import NoResultFound

from docs.models.db import Document, Course, CourseTemplate, CourseMember
from sqlalchemy import select, delete

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
