from typing import List

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Table, func, Enum, Float, ARRAY
from sqlalchemy.orm import mapped_column

from database import Base


class Document(Base):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True)
    manager_id = Column(Integer, nullable=False)
    director_id = Column(Integer, nullable=False)
    administrator_id = Column(Integer, nullable=False)
    autor_id = Column(Integer, nullable=False)
    members_id = Column(ARRAY(Integer), nullable=False)

    is_confirmed = Column(Boolean, nullable=False, default=False)
    manager_status = Column(Boolean, nullable=False, default=False)
    director_status = Column(Boolean, nullable=False, default=False)
    administrator_status = Column(Boolean, nullable=False, default=False)
    is_completed = Column(Boolean, nullable=False, default=False)
    course_id = mapped_column(ForeignKey("course.id"), index=True)
    state = Column(String, nullable=False, default="test")


class Course(Base):
    __tablename__ = "course"

    id = Column(Integer, primary_key=True)
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

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    type = Column(String, nullable=True)
    category = Column(String, nullable=True)
    education_center = Column(String, nullable=True)


class CourseMember(Base):
    __tablename__ = "course_member"

    id = Column(Integer, primary_key=True)
    member_id = mapped_column(ForeignKey('employee.id'), nullable=False)
    course_id = mapped_column(ForeignKey('course.id'), nullable=False)



class DocumentCommand(Base):
    __tablename__ = "document_command"

    id = Column(Integer, primary_key=True)
    employee_id = mapped_column(ForeignKey('employee.id'), nullable=False)
    document_id = mapped_column(ForeignKey('document.id'), nullable=False)
    command = Column(String, nullable=False)
