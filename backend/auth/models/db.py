from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, JSON
from sqlalchemy.orm import mapped_column

from database import Base


class Role(Base):
    __tablename__ = 'role'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    permission = Column(JSON)


class User(SQLAlchemyBaseUserTable[int], Base):
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    hashed_password: str = Column(String(length=1024), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    is_verified: bool = Column(Boolean, default=False, nullable=False)
    is_superuser: bool = Column(Boolean, default=False, nullable=False)
    employee_id = mapped_column(ForeignKey('employee.id'), nullable=False)

