from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware

from auth.services.users_api import get_users_router
from company.services.heads_definer import heads_definer_router
from company.services.org_structure import org_router
from config import settings

from auth.auth import auth_backend
from auth.models.db import User
from auth.models.schemas import UserRead, UserCreate, UserUpdate
from docs.services.command_execute import execute_router

from docs.services.course_application import application_router

from docs.services.course_template import docs_router


from auth.utils.user_auth import fastapi_users, current_user
from docs.services.search_documents import search_document_router

app = FastAPI(title="Etude API docs", version='0.1.9')

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

app.include_router(
    get_users_router(get_user_manager=fastapi_users.get_user_manager,
                     user_schema=UserRead,
                     user_update_schema=UserUpdate,
                     authenticator=fastapi_users.authenticator),
    prefix="/users",
    tags=["users"],
)

app.include_router(docs_router, tags=['course-templates'])
app.include_router(application_router, tags=['course-application'])
app.include_router(org_router, tags=['org-structure'])
app.include_router(heads_definer_router, tags=['course-application'])
app.include_router(search_document_router, tags=['search-document'])
app.include_router(execute_router, tags=['course-application'])


@app.get("/protected-route")
def protected_route(user: User = Depends(current_user)):
    return f"Hello, hay"


@app.post("/unprotected-route")
async def unprotected_route():
    return f"Hello, anonym"
