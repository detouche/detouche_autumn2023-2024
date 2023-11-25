from typing import Annotated

from fastapi import FastAPI, Depends
from fastapi_users import FastAPIUsers
from starlette.middleware.cors import CORSMiddleware

from auth.auth import auth_backend
from auth.models.db import User
from auth.models.schemas import UserRead, UserCreate
from auth.services.user import get_user_manager
from config import settings
from company.repository.company import EmployeeRepository
from company.models.schemas import EmployeeSchema
from docs.services.course_template import docs_router

app = FastAPI(title="Система внешнего обучения")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

fastapi_users = FastAPIUsers(
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend, requires_verification=True),
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

app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(docs_router, tags=['course-templates'])

current_user = fastapi_users.current_user()


@app.get("/protected-route")
def protected_route(user: User = Depends(current_user)):
    return f"Hello, {user.name}"


@app.post("/unprotected-route")
async def unprotected_route(employee: EmployeeSchema):
    employee_dict = employee.model_dump()
    test = await EmployeeRepository().update_one(employee_dict)
    print(test)
    return f"Hello, anonym"
