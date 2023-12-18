from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import select

from auth.models.db import User
from auth.utils.user_auth import current_user
from company.models.db import Employee
from company.repository.company import EmployeeRepository
from company.services.org_structure import get_head_employee_ids
from database import async_session_maker
from docs.models.db import Document

from docs.models.schemas import DocumentSchema
from docs.repository.docs import DocumentRepository, CourseRepository, MemberCourseRepository, DocumentCommandRepository
from docs.services.command_execute import CommandType, CommandTypeText
from docs.services.search_documents import DocumentState

application_router = APIRouter(prefix='/docs', tags=['course-application'])
document_command_repository = DocumentCommandRepository()
employee_repository = EmployeeRepository()


async def get_admins():
    async with async_session_maker() as session:
        return (await session.execute(select(Employee.id).filter(Employee.role_id == 2))).scalars().all()


@application_router.post("/course-application/create", response_model=DocumentSchema)
async def create_application(document: DocumentSchema, user: User = Depends(current_user)):
    """Создание заявки на курс"""
    document_dict = document.model_dump()

    head_employee_ids = await get_head_employee_ids(document.members_id[0])
    admins = await get_admins()
    if document_dict['manager_id'] not in head_employee_ids:
        raise HTTPException(status_code=400, detail={
            'code': 'MANAGER_VALIDATION_ERROR',
            'reason': '...'
        })
    if document_dict['director_id'] not in head_employee_ids:
        raise HTTPException(status_code=400, detail={
            'code': 'DIRECTOR_VALIDATION_ERROR',
            'reason': '...'
        })
    if document_dict['administrator_id'] not in admins:
        raise HTTPException(status_code=400, detail={
            'code': 'ADMIN_VALIDATION_ERROR',
            'reason': '...'
        })
    course_dict = document_dict["course"]
    document_dict['state'] = DocumentState.ON_CONFIRMATION.name
    document_dict["autor_id"] = user.employee_id
    members_list = document_dict["members_id"]
    if len(members_list) == 0:
        raise HTTPException(status_code=409, detail="Не переданы ID участников курса")
    course_id = await CourseRepository().add_one(course_dict)

    del document_dict["course"]
    del document_dict["commands"]
    document_dict["course_id"] = course_id
    course_dict["course_id"] = course_id
    print(document_dict)
    document_id = await DocumentRepository().add_one(document_dict)
    for member in members_list:
        member_course_dict = {"member_id": member, "course_id": course_id}
        await MemberCourseRepository().add_one(member_course_dict)

    await document_command_repository.add_one({
        'employee_id': document_dict['administrator_id'],
        'document_id': document_id,
        'command': CommandType.CONFIRM.value,
    })

    await document_command_repository.add_one({
        'employee_id': document_dict['administrator_id'],
        'document_id': document_id,
        'command': CommandType.REJECT.value,
    })

    return await DocumentRepository().find_one(document_id)


@application_router.get("/course-application")
async def get_all_application(user: User = Depends(current_user)):
    """Список всех заявок на курсы"""
    applications = await DocumentRepository().find_all()
    result = []
    for application in applications:
        application = await DocumentRepository().get_one(application.id)
        course = await CourseRepository().get_one(application.course_id)
        if not course:
            raise HTTPException(status_code=409, detail="Существующая заявка не связана с курсом")

        commands = await document_command_repository.find_all({
            'document_id': application.id,
            'employee_id': user.employee_id,
        })

        if commands:
            commands = [{f'{command.command}': CommandTypeText[command.command]} for command in commands]
        application_schema = ({"id": application.id} |
                              DocumentSchema.to_read_model(application, course,
                                                           commands).model_dump() | {
                                  'creation_date': application.creation_date}) if course else None
        result.append(application_schema)
    return result


@application_router.get("/course-application/{application_id}")
async def get_application(application_id: UUID, user: User = Depends(current_user)):
    """Получить информацию об одной заявке"""
    application = await DocumentRepository().get_one(application_id)
    if not application:
        raise HTTPException(status_code=409, detail="Такой заявки не существует")
    course = await CourseRepository().get_one(application.course_id)
    commands = await document_command_repository.find_all({
        'document_id': application_id,
        'employee_id': user.employee_id,
    })
    print(application.creation_date)
    if commands:
        commands = [{f'{command.command}': CommandTypeText[command.command]} for command in commands]
    application_schema = ({"id": application.id} |
                          DocumentSchema.to_read_model(application, course,
                                                       commands).model_dump() | {
                              'creation_date': application.creation_date}) if course else None
    return application_schema


@application_router.delete("/course-application/delete", response_model=DocumentSchema)
async def delete_application(application_id: UUID, user: User = Depends(current_user)):
    """Удалить заявку"""
    application = await DocumentRepository().get_one(application_id)
    if not application:
        raise HTTPException(status_code=409, detail="Заявки с таким ID не существует")
    course = await CourseRepository().get_one(application.course_id)
    if course:
        await MemberCourseRepository().delete_link(course.id)
        await DocumentRepository().delete_one(application.id)
        await CourseRepository().delete_one(application.course_id)
    return DocumentSchema.to_read_model(application, course, None)


class UpdateDocumentSchema(BaseModel):
    manager_id: UUID
    director_id: UUID
    administrator_id: UUID
    members_id: List[UUID]
    title: str
    description: str
    cost: int
    start_date: datetime
    end_date: datetime
    goal: str
    type: str
    category: str
    education_center: str


document_repository = DocumentRepository()
course_repository = CourseRepository()


@application_router.post("/course-application/update")
async def update_application(request: UpdateDocumentSchema, application_id: UUID,
                             user: User = Depends(current_user)):
    """Обновить данные в заявке"""

    try:
        document = await document_repository.find_one(application_id)
        course = await course_repository.find_one(document.course_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DOCUMENT_NOT_FOUND',
            'reason': 'Document with that id is not found'
        })

    if not document.course_id == course.id:
        raise HTTPException(status_code=409, detail="Нарушена связь ID документа и курса")

    members_list = request.members_id
    if len(members_list) == 0:
        raise HTTPException(status_code=409, detail="Передан пустой список members_id")

    for member in members_list:
        try:
            await employee_repository.find_one(member)
        except:
            raise HTTPException(status_code=409, detail="Переданного MemberID не существует")

    head_employee_ids = await get_head_employee_ids(members_list[0])
    admins = await get_admins()
    if request.manager_id not in head_employee_ids:
        raise HTTPException(status_code=400, detail={
            'code': 'MANAGER_VALIDATION_ERROR',
            'reason': '...'
        })
    if request.director_id not in head_employee_ids:
        raise HTTPException(status_code=400, detail={
            'code': 'DIRECTOR_VALIDATION_ERROR',
            'reason': '...'
        })
    if request.administrator_id not in admins:
        raise HTTPException(status_code=400, detail={
            'code': 'ADMIN_VALIDATION_ERROR',
            'reason': '...'
        })

    await document_repository.update_one(document.id, {
        'manager_id': request.manager_id,
        'director_id': request.director_id,
        'administrator_id': request.administrator_id,
        'members_id': request.members_id,
    })
    await course_repository.update_one(course.id, {
        'title': request.title,
        'description': request.description,
        'cost': request.cost,
        'start_date': request.start_date.strftime('%d.%m.%Y'),
        'end_date': request.end_date.strftime('%d.%m.%Y'),
        'goal': request.goal,
        'type': request.type,
        'category': request.category,
        'education_center': request.education_center,
    })

    return {
        'document': await document_repository.find_one(document.id),
        'course': await course_repository.find_one(course.id),
    }
