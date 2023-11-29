from typing import Optional, Union

import jwt
from fastapi import Depends, Request, HTTPException
from fastapi_users import BaseUserManager, IntegerIDMixin, exceptions, models, schemas, FastAPIUsers
from starlette import status

from auth.models.db import User
from auth.repository.user import get_user_db
from company.repository.company import EmployeeRepository
from utils.email_server import simple_send, simple_send2
from config import settings
from ..auth import auth_backend
from ..repository.user import UserRepository

SECRET = settings.SECRET
VERIFY_TOKEN_SECRET = settings.VERIFY_TOKEN_SECRET

user_repository = UserRepository()


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = VERIFY_TOKEN_SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        await UserManager.request_verify(self, user, request)
        payload = {"email": user.email}
        token = jwt.encode(payload, self.verification_token_secret)
        print(f"User {user.id} has registered.")

    async def validate_password(
            self, password: str, user: Union[schemas.UC, models.UP]
    ) -> None:
        """
        Validate a password.

        *You should overload this method to add your own validation logic.*

        :param password: The password to validate.
        :param user: The user associated to this password.
        :raises InvalidPasswordException: The password is invalid.
        :return: None if the password is valid.
        """
        # validation_space_regexp = r'\s'
        # if re.search(validation_space_regexp, password):
        #     raise InvalidPasswordException('Password validation error: Password contains spaces')
        #
        # validation_regexp = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!._]).{8,41}$'
        # if re.search(validation_regexp, password) is None:
        #     raise InvalidPasswordException('Password validation error: Password does not match the conditions')

        return  # pragma: no cover

    async def create(
            self,
            user_create: schemas.UC,
            safe: bool = False,
            request: Optional[Request] = None,
    ) -> models.UP:
        await self.validate_password(user_create.password, user_create)

        email_in_domain = user_create.email.split('@')[1] in settings.ALLOWED_DOMAINS
        if not email_in_domain:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "REGISTER_WRONG_EMAIL_DOMAIN",
                    "reason": "This email domain is not allowed for organization",
                }
            )

        email_in_structure = await EmployeeRepository().find_all({'email': user_create.email})
        if email_in_structure is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "REGISTER_NOT_AVAILABLE_EMAIL",
                    "reason": "The user with this e-mail is not in the organization",
                }
            )

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
        user_dict["employee_id"] = await EmployeeRepository().find_user_by_email(user_create.email)

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
        await simple_send2([user.email], token)
        print(f"User {user.id} has forgot their password. Reset token: {token}")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers(
    get_user_manager,
    [auth_backend],
)


current_user = fastapi_users.current_user()
