from typing import List, Optional

from pydantic import BaseModel


# TODO: формат даты изменить
class CourseSchema(BaseModel):
    title: str
    description: str
    cost: float
    start_date: str
    end_date: str
    goal: str
    type: str
    category: str
    education_center: str

class DocumentSchema(BaseModel):
    manager_id: int
    director_id: int
    administrator_id: int
    autor_id: int
    members_id: List[int]
    is_confirmed: bool
    manager_status: bool
    director_status: bool
    administrator_status: bool
    course_id: Optional[int] = None
    state: str
    is_completed: bool
    course: CourseSchema | None = None

    def to_read_model(application, course):
        return DocumentSchema(
        manager_id=application.manager_id,
        director_id=application.director_id,
        administrator_id=application.administrator_id,
        autor_id=application.autor_id,
        members_id=application.members_id,
        is_confirmed=application.is_confirmed,
        manager_status=application.manager_status,
        director_status=application.director_status,
        administrator_status=application.administrator_status,
        course_id=application.course_id,
        state=application.state,
        is_completed=application.is_completed,
        course=CourseSchema(
            title=course.title,
            description=course.description,
            cost=course.cost,
            start_date=course.start_date,
            end_date=course.end_date,
            goal=course.goal,
            type=course.type,
            category=course.category,
            education_center=course.education_center
        ))


class CourseTemplateSchema(BaseModel):
    title: str
    description: str
    type: str
    category: str
    education_center: str


class CourseTemplateIDSchema(CourseTemplateSchema):
    id: int

