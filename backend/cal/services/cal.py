from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from auth.models.db import User
from auth.utils.user_auth import current_user
from cal.models.schemas import EventSchema, EventFiltersSchema
from company.repository.company import EmployeeRepository
from docs.repository.docs import DocumentRepository, CourseRepository

calendar_router = APIRouter(prefix='/cal', tags=['calendar'])


@calendar_router.post("/get_events", response_model=List[EventSchema])
async def get_events(filters: EventFiltersSchema, date: datetime, member: UUID, user: User = Depends(current_user)) -> List[EventSchema]:
    """
    Возвращает курсы на переданный месяц, текущего пользователя
    """
    filter = filters.model_dump()
    division_employees = await EmployeeRepository().get_employees_by_division(filter["division_id"])
    documents = []
    if division_employees:
        for employee in division_employees:
            employee_documents = await DocumentRepository().get_user_documents(employee.id)
            for document in employee_documents:
                documents.append(document)
    elif member:
        documents = await DocumentRepository().get_user_documents(member)

    result = []
    for document in documents:
        course = await CourseRepository().get_filtered(document.course_id, filters.model_dump())
        print(course)
        if course and course.start_date.month <= date.month <= course.end_date.month:
            result.append(EventSchema.to_read_model(document, course))
        else:
            raise HTTPException(status_code=404, detail="Документы удовлетворяющие фильтрам не найдены")
    return result
