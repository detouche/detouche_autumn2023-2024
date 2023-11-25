from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
    DB_USER: str
    DB_PASS: str

    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: str
    MAIL_SERVER: str
    MAIL_FROM_NAME: str

    SECRET: str
    VERIFY_TOKEN_SECRET: str

    ALLOWED_DOMAINS: List[str] = []

    ORIGINS: List[str] = []

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
