import enum
from sqlalchemy import Enum


class CourseTypeEnum(enum.Enum):
    type_one = "Очный"
    type_two = "Заочный"


class CourseCategoryEnum(enum.Enum):
    soft_skills = "Soft skills"
    hard_skills = "Hard skills"
    management = "Управленческое обучение"
