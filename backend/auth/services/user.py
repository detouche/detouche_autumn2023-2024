from typing import Optional

import jwt
from fastapi import Depends, Request, APIRouter, HTTPException, Body
from fastapi_users import BaseUserManager, IntegerIDMixin, exceptions, models, schemas, FastAPIUsers
from fastapi_users.router.common import ErrorModel, ErrorCode
from pydantic import EmailStr
from starlette import status

from auth.models.db import User
from database import get_user_db
from utils.email_server import simple_send
from ..models.schemas import UserRead
from config import settings

SECRET = settings.SECRET
VERIFY_TOKEN_SECRET = settings.VERIFY_TOKEN_SECRET

verify_router = APIRouter()


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = VERIFY_TOKEN_SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        await UserManager.request_verify(self, user, request)
        payload = {"email": user.email}
        token = jwt.encode(payload, self.verification_token_secret)
        print(f"User {user.id} has registered.")

    async def create(
            self,
            user_create: schemas.UC,
            safe: bool = False,
            request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)
        user_dict["role_id"] = 1

        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user

    async def on_after_request_verify(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        await simple_send([user.email], token)
        print(f"Verification requested for user {user.id}. Verification token: {token}")

    async def on_after_forgot_password(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


@verify_router.post(
    "/request-verify-token",
    status_code=status.HTTP_202_ACCEPTED,
    name="verify:request-token",
)
async def request_verify_token(request: Request, email: EmailStr = Body(..., embed=True),
                               user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager)):
    '''
    API-запрос на отправку письма, для активации аккаунта
    '''
    try:
        user = await user_manager.get_by_email(email)
        await user_manager.request_verify(user, request)
    except (
            exceptions.UserNotExists,
            exceptions.UserInactive,
            exceptions.UserAlreadyVerified,
    ):
        pass

    return None


@verify_router.get(
    "/verify/{token}",
    response_model=UserRead,
    name="verify:verify",
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorModel,
            "content": {
                "application/json": {
                    "examples": {
                        ErrorCode.VERIFY_USER_BAD_TOKEN: {
                            "summary": "Bad token, not existing user or"
                                       "not the e-mail currently set for the user.",
                            "value": {"detail": ErrorCode.VERIFY_USER_BAD_TOKEN},
                        },
                        ErrorCode.VERIFY_USER_ALREADY_VERIFIED: {
                            "summary": "The user is already verified.",
                            "value": {
                                "detail": ErrorCode.VERIFY_USER_ALREADY_VERIFIED
                            },
                        },
                    }
                }
            },
        }
    },
)
async def verify(
        request: Request,
        token: str,
        user_manager: BaseUserManager[models.UP, models.ID] = Depends(get_user_manager),
):
    try:
        user = await user_manager.verify(token, request)
        return schemas.model_validate(UserRead, user)
    except (exceptions.InvalidVerifyToken, exceptions.UserNotExists):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.VERIFY_USER_BAD_TOKEN,
        )
    except exceptions.UserAlreadyVerified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.VERIFY_USER_ALREADY_VERIFIED,
        )
