from typing import List
from uuid import UUID

from pydantic import BaseModel, field_serializer

from company.models.db import StaffUnit


class EmployeeSchema(BaseModel):
    id: int
    email: str
    name: str
    surname: str
    patronymic: str
    role_id: int
    employee_status_id: int


class DivisionSchema(BaseModel):
    id: int
    name: str
    parent_division_id: int
    unit_head_id: int


class AssignmentSchema(BaseModel):
    id: int
    start_date: str
    end_date: str
    user_id: int
    staff_units_id: int


class StaffUnitSchema(BaseModel):
    id: int
    name: str
    division_id: int


class ActingSchema(BaseModel):
    id: int
    replacement_id: int
    substitute_id: int
    division_id: int
    start_date: str
    end_date: str


class DocumentStatus(BaseModel):
    text: str
    type: str


class SearchDocumentResponse(BaseModel):
    id: int
    page_type: str
    title: str
    status: DocumentStatus
    course_type: str
    course_category: str
    education_center: str


class OrgUnitEmployee(BaseModel):
    id: UUID
    name: str
    surname: str
    patronymic: str
    email: str
    staff_unit: StaffUnit

    @field_serializer("staff_unit")
    def serialize_staff_unit(self, staff_unit: StaffUnit, _info):
        return {
            'id': staff_unit.id,
            'name': staff_unit.name,
            'division_id': staff_unit.division_id
        }

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


class OrgUnit(BaseModel):
    id: UUID
    name: str
    status: bool
    children: list | None = None
    employees: List[OrgUnitEmployee] | None = None

    @field_serializer("children")
    def serialize_staff_unit(self, children, _info):
        if not children:
            return None
        children_list = []
        for child in children:
            children_list.append(OrgUnit(
                id=child['id'],
                name=child['name'],
                status=child['status'],
            ))
        return children_list


class OrgTree(BaseModel):
    id: UUID
    title: str
    status: bool
    children: List[OrgUnit]
