from fastapi_users.authentication import AuthenticationBackend, CookieTransport
from fastapi_users.authentication import JWTStrategy

cookie_transport = CookieTransport(cookie_name="accessToken", cookie_max_age=150000)

SECRET = "SECRET"


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=150000)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)