import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

class Config:
    API_TITLE = "EcoTourism API"
    MYSQL_PASSWORD = os.getenv('MYSQL_ROOT_PASSWORD')  # Use the correct variable
    SECRET_KEY=os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://root:{MYSQL_PASSWORD}@127.0.0.1:3306/ecovista'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    JWT_TOKEN_LOCATION = 'cookies'
    JWT_COOKIE_SECURE = True  # Cookies are sent over HTTPS only
    JWT_ACCESS_COOKIE_PATH = '/'  # Path for access cookies
    JWT_REFRESH_COOKIE_PATH = '/token/refresh'  # Path for refresh cookies
