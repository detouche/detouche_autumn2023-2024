from typing import List

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from starlette.responses import JSONResponse

from config import settings


class EmailSchema(BaseModel):
    email: List[EmailStr]


conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def simple_send(email: EmailSchema, token: str = '') -> JSONResponse:
    formatted_token = token.replace('.', '&')
    html = f"""
    <a href="http://localhost:5173/registration/{formatted_token}">ссылка</a>
    <p>http://localhost:5173/registration/{formatted_token}</p>
    
    """

    # token = jwt.encode(token)

    message = MessageSchema(
        subject="Fastapi-Mail module",
        recipients=email,
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})

async def simple_send2(email: EmailSchema, token: str = '') -> JSONResponse:
    formatted_token = token.replace('.', '&')
    html = f"""<p>http://localhost:5173/password-reset-confirmed/{formatted_token}"</p>"""

    # token = jwt.encode(token)

    message = MessageSchema(
        subject="Fastapi-Mail module",
        recipients=email,
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})
