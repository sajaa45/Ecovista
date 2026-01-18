from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from config import Config
from extensions import db
from routes.user_routes import bp as user_Blueprint
from models.user import UserModel

api = Api()

def create_app():
    app = Flask(__name__)

    # Config
    app.config.from_object(Config)

    # Extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    api.init_app(app)

    # Register ONLY this service's blueprint
    api.register_blueprint(user_Blueprint)

    # CORS configuration - Allow all origins for OpenShift
    @app.after_request
    def after_request(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Credentials'] = 'false'
        return response

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001)
