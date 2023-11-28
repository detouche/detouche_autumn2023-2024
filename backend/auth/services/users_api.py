from typing import Type

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from fastapi_users import exceptions, models, schemas
from fastapi_users.authentication import Authenticator
from fastapi_users.manager import BaseUserManager, UserManagerDependency
from fastapi_users.router.common import ErrorCode, ErrorModel

from auth.repository.user import RoleRepository
from company.repository.company import EmployeeRepository, EmployeeStatusRepository, AssignmentRepository, \
    StaffUnitRepository, DivisionRepository

employee_repository = EmployeeRepository()


def get_users_router(
        get_user_manager: UserManagerDependency[models.UP, models.ID],
        user_schema: Type[schemas.U],
        user_update_schema,
        authenticator: Authenticator,
        requires_verification: bool = True,
) -> APIRouter:
    """Generate a router with the authentication routes."""
    router = APIRouter()

    get_current_active_user = authenticator.current_user(
        active=True, verified=True, superuser=False
    )

    async def get_user_or_404(
            id: str,
            user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
    ) -> models.UP:
        try:
            parsed_id = user_manager.parse_id(id)
            return await user_manager.get(parsed_id)
        except (exceptions.UserNotExists, exceptions.InvalidID) as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND) from e

    async def get_admin(user=Depends(get_current_active_user)):
        employee_id = user.employee_id
        employee = await employee_repository.find_one(employee_id)
        if employee.role_id == 2:
            return user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "NOT_ENOUGH_PERMISSIONS",
                "reason": "You have not enough permissions for this action",
            },
        )

    async def get_employee(user):

        employee = await employee_repository.find_one(user.employee_id)
        return employee

    async def get_employee_info(employee):
        employee_status_repository = EmployeeStatusRepository()
        employee_status = await employee_status_repository.find_one(employee.employee_status_id)

        role_repository = RoleRepository()
        role = await role_repository.find_one(employee.role_id)

        assignment_repository = AssignmentRepository()
        assignments = await assignment_repository.find_all({'employee_id': employee.id})
        assignment = assignments[0]

        staff_unit_repository = StaffUnitRepository()
        staff_unit = await staff_unit_repository.find_one(assignment.staff_units_id)

        division_repository = DivisionRepository()
        division = await division_repository.find_one(staff_unit.division_id)
        return {
            'id': employee.id,
            'name': employee.name,
            'surname': employee.surname,
            'patronymic': employee.patronymic,
            'role': {
                'id': employee.role_id,
                'name': role.name,
            },
            'email': employee.email,
            'employee_status': {
                'id': employee.employee_status_id,
                'status_name': employee_status.status_name,
            },
            # 'assignment': [
            #     {column.key: getattr(assignment, column.key) for column in class_mapper(assignment.__class__).mapped_table.c}.update({'staff_units_id': await staff_unit_repository.find_one(assignment.staff_units_id)})
            #     for assignment in assignments
            # ],
            'assignment': {
                'id': assignment.id,
                'start_date': assignment.start_date,
                'end_date': assignment.end_date,
            },
            'staff_unit': {
                'id': staff_unit.id,
                'name': staff_unit.name,
            },
            'division': {
                'id': division.id,
                'name': division.name,
                'parent_division': division.parent_division_id,
                'head_employee': await employee_repository.find_one(division.head_employee_id),
                'status': division.status,
            }
        }

    @router.get(
        "/me",
        # response_model=user_schema,
        # response_model=UserInfoSchema,
        name="users:current_user",
        responses={
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Missing token or inactive user.",
            },
            status.HTTP_403_FORBIDDEN: {
                "description": "Not enough permissions",
            }
        },
    )
    async def me(
            user: models.UP = Depends(get_current_active_user),
    ):
        employee = await get_employee(user)
        employee_info = await get_employee_info(employee)
        return employee_info

    @router.patch(
        "/me",
        response_model=user_schema,
        dependencies=[Depends(get_current_active_user)],
        name="users:patch_current_user",
        responses={
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Missing token or inactive user.",
            },
            status.HTTP_400_BAD_REQUEST: {
                "model": ErrorModel,
                "content": {
                    "application/json": {
                        "examples": {
                            ErrorCode.UPDATE_USER_EMAIL_ALREADY_EXISTS: {
                                "summary": "A user with this email already exists.",
                                "value": {
                                    "detail": ErrorCode.UPDATE_USER_EMAIL_ALREADY_EXISTS
                                },
                            },
                            ErrorCode.UPDATE_USER_INVALID_PASSWORD: {
                                "summary": "Password validation failed.",
                                "value": {
                                    "detail": {
                                        "code": ErrorCode.UPDATE_USER_INVALID_PASSWORD,
                                        "reason": "Password should be"
                                                  "at least 3 characters",
                                    }
                                },
                            },
                        }
                    }
                },
            },
        },
    )
    async def update_me(
            request: Request,
            user_update: user_update_schema,  # type: ignore
            user: models.UP = Depends(get_current_active_user),
            user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
    ):
        try:
            user = await user_manager.update(
                user_update, user, safe=True, request=request
            )
            return schemas.model_validate(user_schema, user)
        except exceptions.InvalidPasswordException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.UPDATE_USER_INVALID_PASSWORD,
                    "reason": e.reason,
                },
            )
        except exceptions.UserAlreadyExists:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail=ErrorCode.UPDATE_USER_EMAIL_ALREADY_EXISTS,
            )

    @router.get(
        "/{id}",
        # response_model=user_schema,
        dependencies=[Depends(get_current_active_user)],
        name="users:user",
        responses={
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Missing token or inactive user.",
            },
            status.HTTP_403_FORBIDDEN: {
                "description": "Not a superuser.",
            },
            status.HTTP_404_NOT_FOUND: {
                "description": "The user does not exist.",
            },
        },
    )
    async def get_user(user=Depends(get_user_or_404)):
        employee = await get_employee(user)
        employee_info = await get_employee_info(employee)
        return employee_info

    @router.patch(
        "/{id}",
        response_model=user_schema,
        dependencies=[Depends(get_admin)],
        name="users:patch_user",
        responses={
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Missing token or inactive user.",
            },
            status.HTTP_403_FORBIDDEN: {
                "description": "Not a superuser.",
            },
            status.HTTP_404_NOT_FOUND: {
                "description": "The user does not exist.",
            },
            status.HTTP_400_BAD_REQUEST: {
                "model": ErrorModel,
                "content": {
                    "application/json": {
                        "examples": {
                            ErrorCode.UPDATE_USER_EMAIL_ALREADY_EXISTS: {
                                "summary": "A user with this email already exists.",
                                "value": {
                                    "detail": ErrorCode.UPDATE_USER_EMAIL_ALREADY_EXISTS
                                },
                            },
                            ErrorCode.UPDATE_USER_INVALID_PASSWORD: {
                                "summary": "Password validation failed.",
                                "value": {
                                    "detail": {
                                        "code": ErrorCode.UPDATE_USER_INVALID_PASSWORD,
                                        "reason": "Password should be"
                                                  "at least 3 characters",
                                    }
                                },
                            },
                        }
                    }
                },
            },
        },
    )
    async def update_user(
            user_update: user_update_schema,  # type: ignore
            request: Request,
            user=Depends(get_user_or_404),
            user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
    ):
        try:
            user = await user_manager.update(
                user_update, user, safe=False, request=request
            )
            return schemas.model_validate(user_schema, user)
        except exceptions.InvalidPasswordException as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.UPDATE_USER_INVALID_PASSWORD,
                    "reason": e.reason,
                },
            )
        except exceptions.UserAlreadyExists:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail=ErrorCode.UPDATE_USER_EMAIL_ALREADY_EXISTS,
            )

    @router.delete(
        "/{id}",
        status_code=status.HTTP_204_NO_CONTENT,
        response_class=Response,
        dependencies=[Depends(get_admin)],
        name="users:delete_user",
        responses={
            status.HTTP_401_UNAUTHORIZED: {
                "description": "Missing token or inactive user.",
            },
            status.HTTP_403_FORBIDDEN: {
                "description": "Not a superuser.",
            },
            status.HTTP_404_NOT_FOUND: {
                "description": "The user does not exist.",
            },
        },
    )
    async def delete_user(
            request: Request,
            user=Depends(get_user_or_404),
            user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
    ):
        await user_manager.delete(user, request=request)
        return None

    return router
