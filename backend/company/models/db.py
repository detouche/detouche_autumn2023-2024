from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import mapped_column

from database import Base


class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    # name = Column(String, nullable=True)
    # surname = Column(String, nullable=True)
    # patronymic = Column(String, nullable=True)
    # role_id = Column(Integer, ForeignKey("role.id"), nullable=True)
    # employee_status_id = Column(Integer, ForeignKey("employee_status.id"), nullable=False)


class EmployeeStatus(Base):
    __tablename__ = "employee_status"

    id = Column(Integer, primary_key=True)
    status_name = Column(String, nullable=False)


class StaffUnit(Base):
    __tablename__ = "staff_unit"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class Division(Base):
    __tablename__ = "division"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    parent_division_id = mapped_column(ForeignKey("division.id"), index=True)
    unit_head_id = mapped_column(ForeignKey("staff_unit.id"), index=True)
    status: bool = Column(Boolean, default=False, nullable=False)


class StaffUnit_Division(Base):
    __tablename__ = "staff_unit_division"

    id = Column(Integer, primary_key=True)
    staff_unit_id = mapped_column(ForeignKey("staff_unit.id"), index=True)
    division_id = mapped_column(ForeignKey("division.id"), index=True)


class Assignment(Base):
    __tablename__ = "assignment"

    id = Column(Integer, primary_key=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
    employee_id = mapped_column(ForeignKey("employee.id"), nullable=False)
    staff_units_id = mapped_column(ForeignKey("staff_unit.id"), index=True)
    is_acting = Column(Boolean, default=False)


class Acting(Base):
    __tablename__ = "acting"

    id = Column(Integer, primary_key=True)
    replacement_id = mapped_column(ForeignKey("user.id"), index=True)
    substitute_id = mapped_column(ForeignKey("user.id"), index=True)
    division_id = mapped_column(ForeignKey("division.id"), index=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
