from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware

from company.services.org_structure import org_router
from config import settings

from auth.auth import auth_backend
from auth.models.db import User
from auth.models.schemas import UserRead, UserCreate


from docs.services.course_application import application_router

from docs.services.course_template import docs_router

from auth.services.user import fastapi_users

app = FastAPI(title="Система внешнего обучения")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
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
app.include_router(application_router, tags=['course-application'])
app.include_router(org_router, tags=['org-structure'])


current_user = fastapi_users.current_user()


@app.get("/protected-route")
def protected_route(user: User = Depends(current_user)):
    return f"Hello, {user.name}"


@app.post("/unprotected-route")
async def unprotected_route():
    return f"Hello, anonym"
