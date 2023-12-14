import uuid

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Table, func, UUID
from sqlalchemy.orm import mapped_column

from database import Base


class Employee(Base):
    __tablename__ = "employee"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=True)
    surname = Column(String, nullable=True)
    patronymic = Column(String, nullable=True)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=True)
    employee_status_id = Column(Integer, ForeignKey("employee_status.id"), nullable=False)


class EmployeeStatus(Base):
    __tablename__ = "employee_status"

    id = Column(Integer, primary_key=True)
    status_name = Column(String, nullable=False)


class StaffUnit(Base):
    __tablename__ = "staff_unit"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    division_id = mapped_column(ForeignKey("division.id", ondelete='CASCADE', onupdate='CASCADE'), index=True)


class Division(Base):
    __tablename__ = "division"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    parent_division_id = mapped_column(ForeignKey("division.id", ondelete='CASCADE', onupdate='CASCADE'), index=True)
    head_employee_id = mapped_column(ForeignKey("employee.id", ondelete='SET NULL', onupdate='CASCADE'), index=True)
    status: bool = Column(Boolean, default=False, nullable=False)


class Assignment(Base):
    __tablename__ = "assignment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
    employee_id = mapped_column(ForeignKey("employee.id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    staff_units_id = mapped_column(ForeignKey("staff_unit.id", ondelete='SET NULL', onupdate='CASCADE'), index=True, nullable=True)
    is_acting = Column(Boolean, default=False)


class Acting(Base):
    __tablename__ = "acting"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    replacement_id = mapped_column(ForeignKey("employee.id", ondelete='CASCADE', onupdate='CASCADE'), index=True)
    substitute_id = mapped_column(ForeignKey("employee.id", ondelete='CASCADE', onupdate='CASCADE'), index=True)
    division_id = mapped_column(ForeignKey("division.id", ondelete='CASCADE', onupdate='CASCADE'), index=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
