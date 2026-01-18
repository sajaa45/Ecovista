import os

class Config:
    API_TITLE = "Activity Service API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"

    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://root:{MYSQL_PASSWORD}@{MYSQL_HOST}:3306/ecovista"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY", "11062003")

    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = os.getenv("JWT_COOKIE_SECURE", "false").lower() == "true"
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/token/refresh"
