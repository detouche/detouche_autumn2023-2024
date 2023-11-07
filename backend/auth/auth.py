from fastapi_users.authentication import AuthenticationBackend, BearerTransport, Transport, Strategy, CookieTransport
from fastapi_users.authentication import JWTStrategy

cookie_transport = CookieTransport(cookie_name="accessToken", cookie_max_age=1500)
# cookie_transport = BearerTransport(tokenUrl="/login")

SECRET = "SECRET"


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=1500)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)


# class BearerResponseRefresh(BaseModel):
#     access_token: str
#     refresh_token: str
#     token_type: str


# class BearerTransportRefresh(BearerTransport):
#     async def get_login_response(self, token: str, refresh_token: str):
#         bearer_response = BearerResponseRefresh(
#             access_token=token,
#             refresh_token=refresh_token,
#             token_type="bearer"
#         )
#         return JSONResponse(bearer_response.dict())


# class AuthenticationBackendRefresh(AuthenticationBackend):
#     def __init__(
#             self,
#             name: str,
#             transport: Transport,
#             get_strategy: DependencyCallable[Strategy[models.UP, models.ID]],
#             get_refresh_strategy: DependencyCallable[Strategy[models.UP, models.ID]]
#     ):
#         self.name = name
#         self.transport = transport
#         self.get_strategy = get_strategy
#         self.get_refresh_strategy = get_refresh_strategy
#
#     async def login(
#             self,
#             strategy: Strategy[models.UP, models.ID],
#             user: models.UP,
#     ):
#         token = await strategy.write_token(user)
#         refresh_strategy = self.get_refresh_strategy()
#         refresh_token = await refresh_strategy.write_token(user)
#         return await self.transport.get_login_response(token=token, refresh_token=refresh_token)


# bearer_transport_refresh = BearerTransportRefresh(tokenUrl="auth/jwt/refresh")


# def get_refresh_jwt_strategy() -> JWTStrategy:
#     return JWTStrategy(secret=SECRET, lifetime_seconds=259200)


# auth_backend_refresh = AuthenticationBackendRefresh(
#     name="jwt",
#     transport=bearer_transport_refresh,
#     get_strategy=get_jwt_strategy,
#     get_refresh_strategy=get_refresh_jwt_strategy,
# )

# fastapi_users = FastAPIUsers_extension[User, int](get_user_manager, [auth_backend_refresh])
