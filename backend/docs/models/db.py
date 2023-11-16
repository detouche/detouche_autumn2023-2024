from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Table, func, Enum, Float
from sqlalchemy.orm import mapped_column

from database import Base
from .myenums import CourseTypeEnum, CourseCategoryEnum


class Document(Base):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True)
    manager_id = Column(Integer, nullable=False)
    director_id = Column(Integer, nullable=False)
    administrator_id = Column(Integer, nullable=False)
    autor_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)


class DocumentStatus(Base):
    __tablename__ = "document_status"

    id = Column(Integer, primary_key=True)
    document_id = mapped_column(ForeignKey("document.id"), nullable=False)
    manager_status = Column(Boolean, nullable=False, default=False)
    director_status = Column(Boolean, nullable=False, default=False)
    administrator_status = Column(Boolean, nullable=False, default=False)
    is_confirmed = Column(Boolean, nullable=False, default=False)


class Course(Base):
    __tablename__ = "course"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    cost = Column(Float, nullable=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), server_default=func.now())
    goal = Column(String, nullable=True)
    type = Column(Enum(CourseTypeEnum), nullable=True)
    category = Column(Enum(CourseCategoryEnum), nullable=True)
    education_center = Column(String, nullable=True)


class CourseTemplate(Base):
    __tablename__ = "course_template"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    type = Column(Enum(CourseTypeEnum), nullable=True)
    category = Column(Enum(CourseCategoryEnum))
    education_center = Column(String, nullable=True)


class CourseDocument(Base):
    __tablename__ = "course_document"

    id = Column(Integer, primary_key=True)
    course_id = mapped_column(ForeignKey('course.id'), nullable=False)
    document_id = mapped_column(ForeignKey('document.id'), nullable=False)


class UserCourse(Base):
    __tablename__ = "user_course"

    id = Column(Integer, primary_key=True)
    user_id = mapped_column(ForeignKey('user.id'), nullable=False)
    course_id = mapped_column(ForeignKey('course.id'), nullable=False)
