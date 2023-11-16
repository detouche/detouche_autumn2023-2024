from docs.models.db import Document, DocumentStatus, Course, CourseTemplate, CourseDocument, UserCourse
from utils.repository import SQLALchemyRepository


class DocumentRepository(SQLALchemyRepository):
    model = Document


class DocumentStatusRepository(SQLALchemyRepository):
    model = DocumentStatus


class CourseRepository(SQLALchemyRepository):
    model = Course


class CourseTemplateRepository(SQLALchemyRepository):
    model = CourseTemplate


class CourseDocumentRepository(SQLALchemyRepository):
    model = CourseDocument


class UserCoursesRepository(SQLALchemyRepository):
    model = UserCourse
