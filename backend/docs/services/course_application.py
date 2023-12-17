from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
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
                                                           commands).model_dump() | {'creation_date': application.creation_date}) if course else None
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



@application_router.post("/course-application/update", response_model=DocumentSchema)
async def update_application(application: DocumentSchema, application_id: UUID,
                             user: User = Depends(current_user)) -> DocumentSchema:
    """Обновить данные в заявке"""
    application_dict = application.model_dump(exclude_unset=True)
    course_dict = application_dict["course"]
    del application_dict["course"]
    members_list = application_dict["members_id"]

    head_employee_ids = await get_head_employee_ids(members_list[0])
    admins = await get_admins()
    if application_dict['manager_id'] not in head_employee_ids:
        raise HTTPException(status_code=400, detail={
            'code': 'MANAGER_VALIDATION_ERROR',
            'reason': '...'
        })
    if application_dict['director_id'] not in head_employee_ids:
        raise HTTPException(status_code=400, detail={
            'code': 'DIRECTOR_VALIDATION_ERROR',
            'reason': '...'
        })
    if application_dict['administrator_id'] not in admins:
        raise HTTPException(status_code=400, detail={
            'code': 'ADMIN_VALIDATION_ERROR',
            'reason': '...'
        })


    if len(members_list) == 0:
        raise HTTPException(status_code=409, detail="Передан пустой список members_id")
    try:
        application = await DocumentRepository().find_one(application_id)
        course = await CourseRepository().find_one(application_dict["course_id"])
    except:
        raise HTTPException(status_code=409, detail="ID заявки/курса не передан, либо его не существует")
    if not application.course_id == course.id:
        raise HTTPException(status_code=409, detail="Нарушена связь ID документа и курса")

    del application_dict['commands']
    await DocumentRepository().update_one(application_id, application_dict)
    await CourseRepository().update_one(application_dict["course_id"], course_dict)
    for member in members_list:
        if member not in application.members_id:
            raise HTTPException(status_code=409, detail="Переданного MemberID не существует")

    commands = await document_command_repository.find_all({
        'document_id': application_id,
        'employee_id': user.employee_id,
    })

    if commands:
        commands = [{f'{command.command}': CommandTypeText[command.command]} for command in commands]
    application_schema = ({"id": application.id} |
                          DocumentSchema.to_read_model(application, course, commands).model_dump()) if course else None

    return application_schema
