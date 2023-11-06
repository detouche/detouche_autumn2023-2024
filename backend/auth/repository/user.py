from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from auth.models.db import User, Employee
from database import get_async_session
from utils.repository import SQLALchemyRepository


class UserRepository(SQLALchemyRepository):
    model = Employee


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)
