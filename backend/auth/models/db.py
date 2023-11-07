from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import MetaData, Table, Column, Integer, String, ForeignKey, JSON, Boolean
from sqlalchemy.orm import DeclarativeBase

metadata = MetaData()


class Base(DeclarativeBase):
    pass


role = Table(
    "role",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, nullable=False),
    Column("permissions", JSON),
)

user = Table(
    "user",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, nullable=False),
    Column("name", String, nullable=True),
    Column("surname", String, nullable=True),
    Column("patronymic", String, nullable=True),
    Column("role_id", Integer, ForeignKey(role.c.id), nullable=True),
    Column("hashed_password", String, nullable=False),
    Column("is_active", Boolean, default=True, nullable=False),
    Column("is_superuser", Boolean, default=False, nullable=False),
    Column("is_verified", Boolean, default=False, nullable=False),
)

employee = Table(
    "employee",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, nullable=False),
)

class User(SQLAlchemyBaseUserTable[int], Base):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
    surname = Column(String, nullable=True)
    patronymic = Column(String, nullable=True)
    email = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey(role.c.id), nullable=True)
    hashed_password: str = Column(String(length=1024), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)

class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
# class Division(Base):
#     __tablename__ = "division"
#
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     parent_division_id = mapped_column(ForeignKey("division.id"), index=True)
#     unit_head_id = mapped_column(ForeignKey("staff_unit.id"), index=True)
#     status: bool = Column(Boolean, default=False, nullable=False)
#
#
# class Assignment(Base):
#     __tablename__ = "assignment"
#
#     id = Column(Integer, primary_key=True)
#     start_date = Column(DateTime(timezone=True), server_default=func.now())
#     end_date = Column(DateTime(timezone=True), server_default=func.now())
#     user_id = mapped_column(ForeignKey(user.c.id), nullable=False)
#     staff_units_id = mapped_column(ForeignKey("staff_unit.id"), index=True)
#
#
# class StaffUnit(Base):
#     __tablename__ = "staff_unit"
#
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     division_id = mapped_column(ForeignKey("division.id"), index=True)
#
#
# class Acting(Base):
#     __tablename__ = "acting"
#
#     id = Column(Integer, primary_key=True)
#     replacement_id = mapped_column(ForeignKey("user.id"), index=True)
#     substitute_id = mapped_column(ForeignKey("user.id"), index=True)
#     division_id = mapped_column(ForeignKey("division.id"), index=True)
#     start_date = Column(DateTime(timezone=True), server_default=func.now())
#     end_date = Column(DateTime(timezone=True), server_default=func.now())
