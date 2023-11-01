from fastapi import FastAPI
from fastapi_users import FastAPIUsers
from starlette.middleware.cors import CORSMiddleware

from auth.auth import auth_backend
from auth.models.db import User
from auth.models.schemas import UserRead, UserCreate
from auth.services.user import get_user_manager, verify_email

from auth.services.user import verify_router

from fastapi import Depends

app = FastAPI(
    title="Система внешнего обучения"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

fastapi_users = FastAPIUsers(
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)

current_user = fastapi_users.current_user()

app.include_router(
    verify_router,
    prefix="/auth",
    tags=["auth"],
)


@app.get("/protected-route")
def protected_route(user: User = Depends(current_user)):
    return f"Hello, {user.name}"


@app.get("/unprotected-route")
def unprotected_route():
    return f"Hello, anonym"




# app.include_router(
#     fastapi_users.get_auth_router(auth_backend_refresh),
#     prefix="/api/v1/user",
#     tags=["auth"],
# )


# @app.get("/auth/jwt/refresh")
# async def refresh_jwt(strategy=Depends(get_jwt_strategy),
#                       refresh_token=Cookie(), user=Depends(current_user)):
#     print('gfh')
#     valid_token = check_refresh_token(refresh_token)
#     if not valid_token:
#         raise HTTPException(status_code=401, detail='Invalid token')
#
#     token = await strategy.write_token(user)
#     print(token)
#     return await cookie_transport.get_login_response(token)
#
# def check_refresh_token(token: str) -> bool:
#     # Check expiry in Redis instead of in cookie
#     # If expired then return False
#
#     # Sample
#     return True

# TODO:
# 1. Привести в порядок repository.py
# 2. Добавить верификацию срока жизни токена
# 3. Добавить исключения, если токен неверный, истек и т.п.
# 4. Добавить токен в ссылку для письма
# 5. Привести в порядок функцию verify_email

