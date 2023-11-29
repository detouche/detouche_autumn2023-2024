from typing import Optional
from fastapi_users import schemas
from fastapi_users.schemas import CreateUpdateDictModel


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str

    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    email: str
    password: str



class BaseUserUpdate(CreateUpdateDictModel):
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None


class UserUpdate(BaseUserUpdate):
    password: str

