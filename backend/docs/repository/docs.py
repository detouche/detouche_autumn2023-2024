from sqlalchemy import select

from database import async_session_maker
from docs.models.db import Document, Course, CourseTemplate
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
