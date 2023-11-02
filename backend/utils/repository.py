from abc import ABC, abstractmethod

from sqlalchemy import insert, select

from database import async_session_maker


class AbstractRepository(ABC):
    @abstractmethod
    async def add_one(self):
        raise NotImplementedError

    @abstractmethod
    async def find_all(self):
        raise NotImplementedError

    @abstractmethod
    async def update_one(self):
        raise NotImplementedError


class SQLALchemyRepository(AbstractRepository):
    model = None

    async def add_one(self, data: dict):
        async with async_session_maker() as session:
            stmt = insert(self.model).values(**data).returning(self.model.id)
            result = await session.execute(stmt)
            await session.commit()
            return result.scalar_one()

    async def find_all(self):
        async with async_session_maker() as session:
            stmt = select(self.model)
            result = await session.execute(stmt)
            result = [row[0].to_read_model() for row in result.all()]
            return result
