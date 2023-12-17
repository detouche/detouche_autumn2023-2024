from enum import Enum
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from auth.models.db import User
from auth.utils.user_auth import current_user
from company.models.schemas import SearchDocumentResponse, DocumentStatus
from company.repository.company import EmployeeRepository
from docs.repository.docs import DocumentRepository, CourseRepository

search_document_router = APIRouter(prefix='/docs', tags=['search-document'])
document_repository = DocumentRepository()
course_repository = CourseRepository()
employee_repository = EmployeeRepository()


class DocumentState(Enum):
    """
    Enum с возможными статусами заявки.
    """
    ON_CONFIRMATION = 'На подтверждении'
    ON_MANAGER_APPROVE = 'На согласовании'
    ON_DIRECTOR_APPROVE = 'На согласовании'
    ON_ADMIN_APPROVE = 'На согласовании'
    ON_ADMIN_IMPLEMENTING = 'Ожидает записи на обучение'
    COMPLETED = 'Записан на обучение'
    REJECTED = 'Отклонено'


def format_user_name(name: str, surname: str, patronymic: str):
    """
    Форматирует имя пользователя в следующий вид: Иванов И. И.

    Args:
    name: Имя.
    surname: Фамилия.
    patronymic: Отчество.

    Returns:
    Строка с отформатированным именем пользователя.
    """

    if not name or not surname or not patronymic:
        return None

    return f"{surname} {name[0]}. {patronymic[0]}."

async def get_document_list(applications: list, page_type: str) -> List[SearchDocumentResponse]:
    """
    Функция формирования модели SearchDocumentResponse, которая содержит
    необходимую информацию для рендеринга списка документов.

    :param applications: Список найденных записей в БД,
    соответствующих условиям для текущей страницы.
    :param page_type: Тип страницы, посещенной пользователем.
    """
    result = []
    if not applications:
        return None
    for application in applications:
        course = await course_repository.get_one(application.course_id)
        if not course:
            raise HTTPException(status_code=409, detail="Существующая заявка не связана с курсом")

        author = await employee_repository.find_one(application.autor_id)
        application_schema = SearchDocumentResponse(
            id=application.id,
            page_type=page_type,
            title=course.title,
            status=DocumentStatus(
                text=DocumentState[application.state].value,
                type=application.state
            ),
            course_type=course.type,
            course_category=course.category,
            education_center=course.education_center,
            creation_date=application.creation_date,
            author=format_user_name(author.name, author.surname, author.patronymic),
        )

        result.append(application_schema)
    return result


async def get_my_docs(user: User, page_type: str):
    """
    Функция получения списка документов, автором которых является пользователь.

    :param user: Модель текущего пользователя FastAPI Users.
    :param page_type: Тип страницы, посещенной пользователем.
    """
    applications = await document_repository.find_all({
        'autor_id': user.employee_id
    })
    return await get_document_list(applications, page_type)


async def get_investigation_docs(user: User, page_type: str):
    """
    Функция получения списка документов, статус которых «На рассмотрении».

    Документы для этой страницы отображаются для пользователей,
    которые являются руководителями или директорами в контексте этого документа.

    Для администратора на этой странице отображаются только те документы,
    которые находятся у него на рассмотрении перед выполнением.

    :param user: Модель текущего пользователя FastAPI Users.
    :param page_type: Тип страницы, посещенной пользователем.
    """
    applications = await document_repository.find_all({
        'administrator_id': user.employee_id,
        'manager_id': user.employee_id,
        'director_id': user.employee_id
    }, OR=True)
    return await get_document_list(applications, page_type)


async def get_in_work_docs(user: User, page_type: str):
    """
    Функция получения списка документов, статус которых «В работе».

    Документы для этой страницы отображаются в основном только для администратора.

    :param user: Модель текущего пользователя FastAPI Users.
    :param page_type: Тип страницы, посещенной пользователем.
    """
    applications = await document_repository.find_all({
        'administrator_id': user.employee_id,
        'state': 'ON_ADMIN_IMPLEMENTING'
    }, AND=True)
    return await get_document_list(applications, page_type)


async def get_all_docs(user: User, page_type: str):
    """
    Функция получения списка всех документов, к которым пользователь имеет доступ.

    :param user: Модель текущего пользователя FastAPI Users.
    :param page_type: Тип страницы, посещенной пользователем.
    """
    applications = await document_repository.find_all({
        'administrator_id': user.employee_id,
        'manager_id': user.employee_id,
        'director_id': user.employee_id,
        'autor_id': user.employee_id,
    }, OR=True)
    return await get_document_list(applications, page_type)


# Словарь функций для определения списка документов под конкретную посещенную пользователем страницу
page_typing = {
    'my': get_my_docs,
    'investigation': get_investigation_docs,
    'in_work': get_in_work_docs,
    'all': get_all_docs,
}


class DocumentType(Enum):
    """
    Enum с возможными для посещения страницами, где необходим вывод списка доступных документов.
    """
    get_my_docs = 'my'  # Страница «Мои заявки»
    get_investigation_docs = 'investigation'  # Страница «На рассмотрении»
    get_in_work_docs = 'in_work'  # Страница «В работе»
    get_all_docs = 'all'  # Страница «Все документы»


@search_document_router.post("/search-document", response_model=List[SearchDocumentResponse] | None)
async def search_document(request: DocumentType, user: User = Depends(current_user)):
    """
    Функция поиска документов, доступных пользователю на посещенной им странице.
    """
    return await page_typing[request.value](user, request.value)
