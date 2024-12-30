import os

class Config:
    API_TITLE= "EcoTourism API"
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://root:{MYSQL_PASSWORD}@localhost/ecovista'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    API_VERSION= "v1"
    OPENAPI_VERSION= "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'default_secret_key')