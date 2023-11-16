from abc import ABC, abstractmethod

from fastapi import Depends
from sqlalchemy import insert, select, update, delete

from database import get_async_session


class AbstractRepository(ABC):
    @abstractmethod
    async def add_one(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def update_one(self):
        raise NotImplementedError

    @abstractmethod
    async def delete_one(self):
        raise NotImplementedError

    @abstractmethod
    async def find_one(self):
        raise NotImplementedError

    @abstractmethod
    async def find_all(self):
        raise NotImplementedError


class SQLALchemyRepository(AbstractRepository):
    model = None

    def __init__(self, session=Depends(get_async_session)):
        self.session = session

    async def add_one(self, data: dict):
        stmt = insert(self.model).values(**data).returning(self.model.id)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one()

    async def find_all(self, conditions: dict = None):
        query = select(self.model)

        if conditions:
            for key, value in conditions.items():
                query = query.where(getattr(self.model, key) == value)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def update_one(self, record_id: int, data: dict):
        stmt = update(self.model).where(self.model.id == record_id).values(data)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount

    async def find_one(self, record_id: int):
        query = select(self.model).where(self.model.id == record_id)
        result = await self.session.execute(query)
        return result.scalar_one() if result.scalar() is not None else None

    async def delete_one(self, record_id: int):
        stmt = delete(self.model).where(self.model.id == record_id)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount
