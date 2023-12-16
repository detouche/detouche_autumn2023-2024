import uuid
from typing import List

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Table, func, Enum, Float, ARRAY, UUID
from sqlalchemy.orm import mapped_column

from database import Base


class Document(Base):
    __tablename__ = "document"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    manager_id = mapped_column(ForeignKey('employee.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    director_id = mapped_column(ForeignKey('employee.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    administrator_id = mapped_column(ForeignKey('employee.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    autor_id = mapped_column(ForeignKey('employee.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    members_id = Column(ARRAY(UUID), nullable=False)

    is_confirmed = Column(Boolean, nullable=False, default=False)
    manager_status = Column(Boolean, nullable=False, default=False)
    director_status = Column(Boolean, nullable=False, default=False)
    administrator_status = Column(Boolean, nullable=False, default=False)
    is_completed = Column(Boolean, nullable=False, default=False)
    course_id = mapped_column(ForeignKey("course.id", ondelete='CASCADE', onupdate='CASCADE'), index=True)
    state = Column(String, nullable=False, default="test")


class Course(Base):
    __tablename__ = "course"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    cost = Column(Float, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    goal = Column(String, nullable=True)
    type = Column(String, nullable=True)
    category = Column(String, nullable=True)
    education_center = Column(String, nullable=True)


class CourseTemplate(Base):
    __tablename__ = "course_template"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    type = Column(String, nullable=True)
    category = Column(String, nullable=True)
    education_center = Column(String, nullable=True)


class CourseMember(Base):
    __tablename__ = "course_member"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    member_id = mapped_column(ForeignKey('employee.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    course_id = mapped_column(ForeignKey('course.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)



class DocumentCommand(Base):
    __tablename__ = "document_command"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = mapped_column(ForeignKey('employee.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    document_id = mapped_column(ForeignKey('document.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    command = Column(String, nullable=False)
