from flask import Flask
from routes.user_routes import bp as user_Blueprint
from routes.destination_routes import bp as destination_Blueprint
from routes.booking_routes import bp as booking_Blueprint
from routes.review_routes import bp as review_Blueprint
import config
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(config.Config)
    print(app.config['SQLALCHEMY_DATABASE_URI'])
    # Database Configuration
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Gilmore2003*@127.0.0.1/ecovista'
    #app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy
    db.init_app(app)

    app.register_blueprint(user_Blueprint)
    app.register_blueprint(destination_Blueprint)
    app.register_blueprint(booking_Blueprint)
    app.register_blueprint(review_Blueprint)

    return app