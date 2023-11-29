from typing import List

from fastapi import APIRouter, HTTPException, Depends

from auth.models.db import User
from auth.services.user import current_user
from docs.models.schemas import CourseTemplateSchema, CourseTemplateIDSchema
from docs.repository.docs import CourseTemplateRepository

docs_router = APIRouter(prefix='/docs', tags=['course-templates'])


@docs_router.post("/course-template/create", response_model=CourseTemplateSchema)
async def create_course_template(document: CourseTemplateSchema, user: User = Depends(current_user)) -> CourseTemplateSchema:
    """Создание шаблона курса"""
    document_dict = document.model_dump()
    if await CourseTemplateRepository().find_all(document_dict):
        raise HTTPException(status_code=409, detail="Шаблон уже существует")
    else:
        await CourseTemplateRepository().add_one(document_dict)
    return document


# TODO: посик по title не фурычит
@docs_router.post("/course-template/update", response_model=CourseTemplateIDSchema)
async def update_course_template(document: CourseTemplateIDSchema, user: User = Depends(current_user)) -> CourseTemplateIDSchema:
    """Редактирование шаблона курса"""
    document_dict = document.model_dump()
    if not await CourseTemplateRepository().find_title(document_dict['title']):
        await CourseTemplateRepository().update_one(document_dict['id'], document_dict)
        result = await CourseTemplateRepository().get_one(document_dict['id'])
    else:
        raise HTTPException(status_code=409, detail="Кал")
    return document


@docs_router.get("/course-template", response_model=List[CourseTemplateIDSchema])
async def get_all_course_template(user: User = Depends(current_user)) -> List[CourseTemplateIDSchema]:
    """Вывод списка шаблонов курсов"""
    templates = await CourseTemplateRepository().find_all()
    return templates


@docs_router.get("/course-template/{template_id}", response_model=CourseTemplateIDSchema)
async def get_course_template(template_id: int, user: User = Depends(current_user)) -> CourseTemplateIDSchema:
    """Информация о шаблоне"""
    template = await CourseTemplateRepository().get_one(record_id=template_id)
    if not template:
        raise HTTPException(status_code=409, detail="Такого шаблона не существует")
    return template


@docs_router.delete("/course-template/delete", response_model=CourseTemplateIDSchema)
async def delete_course_template(template_id: int, user: User = Depends(current_user)) -> CourseTemplateIDSchema:
    """Удаление шаблона"""
    template = await CourseTemplateRepository().get_one(record_id=template_id)
    if not template:
        raise HTTPException(status_code=409, detail="Такого шаблона не существует")
    await CourseTemplateRepository().delete_one(record_id=template_id)
    return template
