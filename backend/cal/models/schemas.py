from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from docs.models.schemas import CourseSchema


class EventFiltersSchema(BaseModel):
    title: Optional[str] = None
    education_center: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    division_id: Optional[UUID] = None

class EventSchema(BaseModel):
    manager_id: UUID
    director_id: UUID
    administrator_id: UUID
    autor_id: UUID
    members_id: List[UUID]
    is_confirmed: bool = False
    manager_status: bool = False
    director_status: bool = False
    administrator_status: bool = False
    course_id: Optional[UUID] = None
    state: str = '1'
    is_completed: bool = False
    course: CourseSchema | None = None

    def to_read_model(application, course):
        return EventSchema(
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