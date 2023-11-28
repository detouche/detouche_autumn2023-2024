from typing import List

from fastapi import APIRouter, HTTPException

from docs.models.schemas import DocumentSchema
from docs.repository.docs import DocumentRepository, CourseRepository, MemberCourseRepository

application_router = APIRouter(prefix='/docs', tags=['course-application'])

#Todo: добавить ошибку "не переданы id участников"
@application_router.post("/course-application/create", response_model=DocumentSchema)
async def create_application(document: DocumentSchema):
    """Создание заявки на курс"""
    document_dict = document.model_dump()
    course_dict = document_dict["course"]
    members_list = document_dict["members_id"]
    course_id = await CourseRepository().add_one(course_dict)
    if course_id:
        del document_dict["course"]
        document_dict["course_id"] = course_id
        course_dict["course_id"] = course_id
        document_id = await DocumentRepository().add_one(document_dict)
        for member in members_list:
            member_course_dict = {"member_id": member, "course_id":course_id}
            await MemberCourseRepository().add_one(member_course_dict)
    else:
        raise HTTPException(status_code=409, detail="Передавать iD курса не надо")
    return await DocumentRepository().find_one(document_id)



@application_router.get("/course-application", response_model=List[DocumentSchema])
async def get_all_application() -> List[DocumentSchema]:
    """Список всех заявок на курсы"""
    applications = await DocumentRepository().find_all()
    result = []
    for application in applications:
        application = await DocumentRepository().get_one(application.id)
        course = await CourseRepository().get_one(application.course_id)
        if not course:
            raise HTTPException(status_code=409, detail="Существующая заявка не связана с курсом")
        application_schema = DocumentSchema.to_read_model(application, course) if course else None
        result.append(application_schema)
    return result


@application_router.get("/course-application/{application_id}", response_model=DocumentSchema)
async def get_application(application_id: int):
    """Получить информацию об одной заявке"""
    application = await DocumentRepository().get_one(application_id)
    if not application:
        raise HTTPException(status_code=409, detail="Такой заявки не существует")
    course = await CourseRepository().get_one(application.course_id)
    application_schema = DocumentSchema.to_read_model(application, course) if course else None
    return application_schema



@application_router.delete("/course-application/delete", response_model=DocumentSchema)
async def delete_application(application_id: int):
    """Удалить заявку"""
    application = await DocumentRepository().get_one(application_id)
    if not application:
        raise HTTPException(status_code=409, detail="Заявки с таким ID не существует")
    course = await CourseRepository().get_one(application.course_id)
    if course:
        await MemberCourseRepository().delete_link(course.id)
        await DocumentRepository().delete_one(application.id)
        await CourseRepository().delete_one(application.course_id)
    return DocumentSchema.to_read_model(application, course)

#todo: если передать пустой members_list, то связи в таблице нарушатся
#todo: добавить проверку на соответствие application_id и course_id
@application_router.post("/course-application/update", response_model=DocumentSchema)
async def update_application(application: DocumentSchema, application_id:int, course_id:int) -> DocumentSchema:
    """Обновить данные в заявке"""
    application_dict = application.model_dump()
    course_dict = application_dict["course"]
    del application_dict["course"]
    members_list = application_dict["members_id"]
    if not DocumentRepository().find_one(application_id) and CourseRepository().find_one(course_id):
        raise HTTPException(status_code=409, detail="ID заявки/курса не передан, либо его не существует")
    await DocumentRepository().update_one(application_id, application_dict)
    await CourseRepository().update_one(course_id, course_dict)
    await MemberCourseRepository().delete_link(course_id)
    for member in members_list:
        member_course_dict = {"member_id": member, "course_id": course_id}
        await MemberCourseRepository().add_one(member_course_dict)
    new_application = await DocumentRepository().get_one(application_id)
    new_course = await CourseRepository().get_one(course_id)
    return DocumentSchema.to_read_model(new_application, new_course)
