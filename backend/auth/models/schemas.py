from typing import Optional
from fastapi_users import schemas
from fastapi_users.schemas import CreateUpdateDictModel


class UserRead(schemas.BaseUser[int]):
    id: int
    email: str
    is_active: bool = True
    is_superuser: bool
    is_verified: bool

    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    email: str
    password: str
    # id: int
    # name: Optional[str]
    # surname: Optional[str]
    # patronymic: Optional[str]
    # role_id: Optional[int]
    # is_active: Optional[bool] = True
    # is_superuser: Optional[bool] = False
    # is_verified: Optional[bool] = False


class BaseUserUpdate(CreateUpdateDictModel):
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None


class UserUpdate(BaseUserUpdate):
    password: str

