from flask import Flask
from flask_smorest import Api
from routes.user_routes import bp as user_Blueprint
from routes.destination_routes import bp as destination_Blueprint
from routes.booking_routes import bp as booking_Blueprint
from routes.review_routes import bp as review_Blueprint
from routes.travel_group_routes import bp as travelgroups_Blueprint
from routes.auth_routes import bp as auth_Blueprint
from config import Config  # Import the Config class
from extensions import db
from flask_migrate import Migrate
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)  # Load configuration from Config class
    print(app.config['SQLALCHEMY_DATABASE_URI'])  # Optional: Print the database URI for debugging
    db.init_app(app)
    migrate = Migrate()
    migrate.init_app(app, db)
    api = Api(app)
    with app.app_context():
        db.create_all()  # Create database tables
    api.register_blueprint(user_Blueprint)
    api.register_blueprint(destination_Blueprint)
    api.register_blueprint(booking_Blueprint)
    api.register_blueprint(review_Blueprint)
    api.register_blueprint(travelgroups_Blueprint)
    api.register_blueprint(auth_Blueprint)
    return app