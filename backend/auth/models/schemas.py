from typing import Optional
from pydantic import BaseModel
from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    name: str
    surname: str
    patronymic: str
    role_id: int
    is_active: bool = True
    is_superuser: bool
    is_verified: bool

    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    email: str
    password: str
    role_id: int
    id: int
    name: str
    surname: str
    patronymic: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class DivisionSchema(BaseModel):
    id: int
    name: str
    parent_division_id: int
    unit_head_id: int


class AssignmentSchema(BaseModel):
    id: int
    start_date: str
    end_date: str
    user_id: int
    staff_units_id: int


class StaffUnitSchema(BaseModel):
    id: int
    name: str
    division_id: int


class ActingSchema(BaseModel):
    id: int
    replacement_id: int
    substitute_id: int
    division_id: int
    start_date: str
    end_date: str
