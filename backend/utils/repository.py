from abc import ABC, abstractmethod

from sqlalchemy import insert, select, func
from sqlalchemy.sql import text
from database import async_session_maker


class AbstractRepository(ABC):
    @abstractmethod
    async def add_one(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def find_user_by_email(self):
        raise NotImplementedError

    # @abstractmethod
    # async def update_one(self):
    #     raise NotImplementedError


class SQLALchemyRepository(AbstractRepository):
    model = None

    async def add_one(self, data: dict):
        async with async_session_maker() as session:
            stmt = insert(self.model).values(**data).returning(self.model.id)
            result = await session.execute(stmt)
            await session.commit()
            return result.scalar_one()

    async def find_user_by_email(self, email):
        async with async_session_maker() as session:
            stmt = select(self.model).filter(self.model.email == email)
            result = await session.execute(stmt)
            found_email = result.scalar_one_or_none()
            if found_email:
                return found_email.email
            return None