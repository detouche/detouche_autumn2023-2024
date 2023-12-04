from enum import Enum

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select, or_, and_

from auth.models.db import User
from auth.utils.user_auth import current_user
from company.repository.company import EmployeeRepository
from database import async_session_maker
from docs.models.db import Document

from docs.repository.docs import DocumentRepository, CourseRepository, MemberCourseRepository, DocumentCommandRepository

execute_router = APIRouter(prefix='/docs', tags=['course-application'])

document_command_repository = DocumentCommandRepository()
document_repository = DocumentRepository()
employee_repository = EmployeeRepository()


class DocumentStateCommand(Enum):
    ON_CONFIRMATION = 'ON_CONFIRMATION'
    ON_MANAGER_APPROVE = 'ON_MANAGER_APPROVE'
    ON_DIRECTOR_APPROVE = 'ON_DIRECTOR_APPROVE'
    ON_ADMIN_APPROVE = 'ON_ADMIN_APPROVE'
    ON_ADMIN_IMPLEMENTING = 'ON_ADMIN_IMPLEMENTING'
    COMPLETED = 'COMPLETED'
    REJECTED = 'REJECTED'


class CommandTypeText(Enum):
    APPROVE = 'Одобрить'
    REJECT = 'Отклонить'
    CONFIRM = 'Подтвердить'
    RESEND_TO_APPROVE = 'Вернуться к рассмотрению'
    COMPLETE = 'Завершить'

async def approve(user, document_command_approve, document):
    async def delete_reject_command():
        try:
            document_command_reject = await document_command_repository.find_all({
                'employee_id': user.employee_id,
                'document_id': document.id,
                'command': CommandType.REJECT.value,
            })
            await document_command_repository.delete_one(document_command_reject[0].id)
        except:
            pass

    if user.employee_id == document.manager_id:
        await document_command_repository.delete_one(document_command_approve[0].id)
        await delete_reject_command()

        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.RESEND_TO_APPROVE.value,
        })
        await document_command_repository.add_one({
            'employee_id': document.director_id,
            'document_id': document.id,
            'command': CommandType.APPROVE.value,
        })
        await document_command_repository.add_one({
            'employee_id': document.director_id,
            'document_id': document.id,
            'command': CommandType.REJECT.value,
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_DIRECTOR_APPROVE.value,
            'manager_status': True,
        })

    if user.employee_id == document.director_id:
        await document_command_repository.delete_one(document_command_approve[0].id)
        await delete_reject_command()

        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.RESEND_TO_APPROVE.value,
        })
        await document_command_repository.add_one({
            'employee_id': document.administrator_id,
            'document_id': document.id,
            'command': CommandType.APPROVE.value,
        })
        await document_command_repository.add_one({
            'employee_id': document.administrator_id,
            'document_id': document.id,
            'command': CommandType.REJECT.value,
        })

        await document_command_repository.delete_one_with_conditions({
            'employee_id': document.manager_id,
            'document_id': document.id,
            'command': CommandType.RESEND_TO_APPROVE.value
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_ADMIN_APPROVE.value,
            'director_status': True,
        })

    if user.employee_id == document.administrator_id:
        await document_command_repository.delete_one(document_command_approve[0].id)
        await delete_reject_command()

        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.COMPLETE.value,
        })

        await document_command_repository.delete_one_with_conditions({
            'employee_id': document.director_id,
            'document_id': document.id,
            'command': CommandType.RESEND_TO_APPROVE.value
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_ADMIN_IMPLEMENTING.value,
            'administrator_status': True,
        })


async def reject(user, document_command_approve, document):
    await document_command_repository.delete_all({
        'document_id': document.id,
    })
    await document_command_repository.add_one({
        'employee_id': user.employee_id,
        'document_id': document.id,
        'command': CommandType.RESEND_TO_APPROVE.value,
    })
    await document_repository.update_one(document.id, {'state': DocumentStateCommand.REJECTED.value})


async def confirm(user, document_command_approve, document):
    await document_command_repository.delete_all({
        'employee_id': user.employee_id,
        'document_id': document.id,
    })

    await document_command_repository.add_one({
        'employee_id': document.manager_id,
        'document_id': document.id,
        'command': CommandType.APPROVE.value,
    })
    await document_command_repository.add_one({
        'employee_id': document.manager_id,
        'document_id': document.id,
        'command': CommandType.REJECT.value,
    })
    await document_repository.update_one(document.id, {
        'state': DocumentStateCommand.ON_MANAGER_APPROVE.value,
        'is_confirmed': True,
    })


async def complete(user, document_command_approve, document):
    await document_command_repository.delete_all({
        'document_id': document.id,
    })
    await document_repository.update_one(document.id, {
        'state': DocumentStateCommand.COMPLETED.value,
        'is_completed': True,
    })


async def resend_to_approve(user, document_command_approve, document):
    await document_command_repository.delete_all({
        'document_id': document.id,
    })

    await document_command_repository.add_one({
        'employee_id': user.employee_id,
        'document_id': document.id,
        'command': CommandType.REJECT.value,
    })

    if user.employee_id == document.manager_id:
        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.APPROVE.value,
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_MANAGER_APPROVE.value,
            'manager_status': False,
        })
    if user.employee_id == document.director_id:
        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.APPROVE.value,
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_DIRECTOR_APPROVE.value,
            'director_status': False,
        })
    if user.employee_id == document.administrator_id and not document.is_confirmed:
        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.CONFIRM.value,
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_CONFIRMATION.value,
            'is_confirmed': False,
        })
    elif user.employee_id == document.administrator_id and document.is_confirmed:
        await document_command_repository.add_one({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': CommandType.APPROVE.value,
        })
        await document_repository.update_one(document.id, {
            'state': DocumentStateCommand.ON_ADMIN_APPROVE.value,
            'administrator_status': False,
        })


command_type_func = {
    'APPROVE': approve,
    'REJECT': reject,
    'CONFIRM': confirm,
    'RESEND_TO_APPROVE': resend_to_approve,
    'COMPLETE': complete,
}


class CommandType(Enum):
    APPROVE = 'APPROVE'
    REJECT = 'REJECT'
    CONFIRM = 'CONFIRM'
    RESEND_TO_APPROVE = 'RESEND_TO_APPROVE'
    COMPLETE = 'COMPLETE'


@execute_router.post("/execute")
async def execute_command(document_id: int, command: CommandType, user: User = Depends(current_user)):
    try:
        document = await document_repository.find_one(document_id)
    except:
        raise HTTPException(status_code=404, detail={
            'code': 'DOCUMENT_NOT_FOUND',
            'reason': 'Document by this id is not found',
        })

    async with async_session_maker() as session:
        query = select(Document).where(
            and_(
                Document.id == document_id,
                or_(
                    Document.manager_id == user.employee_id,
                    Document.director_id == user.employee_id,
                    Document.administrator_id == user.employee_id,
                    Document.autor_id == user.employee_id,
                ),
            ))
        result = await session.execute(query)
    if len(result.scalars().all()) == 0:
        raise HTTPException(status_code=403, detail={
            'code': 'NO_PERMISSIONS',
            'reason': 'You have not enough permissions for this action',
        })

    document_command_approve = await document_command_repository.find_all({
            'employee_id': user.employee_id,
            'document_id': document.id,
            'command': command.value,
        })
    if not document_command_approve:
        raise HTTPException(status_code=403, detail={
            'code': 'NO_PERMISSIONS',
            'reason': 'You have not enough permissions for this action',
        })

    return await command_type_func[command.value](user, document_command_approve, document)
