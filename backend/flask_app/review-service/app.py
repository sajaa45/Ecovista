from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from config import Config
from extensions import db
from routes.review_routes import bp as review_Blueprint
from models.review import ReviewModel

api = Api()

def create_app():
    app = Flask(__name__)

    # CORS
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": ["http://localhost:3000"]}},
    )

    # Config
    app.config.from_object(Config)

    # Extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    api.init_app(app)

    # Register ONLY this service's blueprint
    api.register_blueprint(review_Blueprint)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001)
