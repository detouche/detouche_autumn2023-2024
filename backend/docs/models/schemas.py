from pydantic import BaseModel, Field


class DocumentSchema(BaseModel):
    id: int
    manager_id: int
    director_id: int
    administrator_id: int
    autor_id: int
    user_id: int


class DocumentStatusSchema(BaseModel):
    id: int
    document_id: int
    manager_status: bool
    director_status: bool
    administrator_status: bool
    is_confirmed: bool


# TODO: формат даты изменить
class CourseSchema(BaseModel):
    id: int
    title: str
    description: str
    cost: float
    start_date: str
    end_date: str
    goal: str
    type: str
    category: str
    education_center: str


class CourseTemplateSchema(BaseModel):
    title: str
    description: str
    type: str
    category: str
    education_center: str


class CourseTemplateIDSchema(CourseTemplateSchema):
    id: int

