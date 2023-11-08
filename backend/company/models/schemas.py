from pydantic import BaseModel


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
