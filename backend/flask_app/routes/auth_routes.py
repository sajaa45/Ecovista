from flask.views import MethodView
import config
from flask import request, session, jsonify, abort, make_response
from flask_smorest import Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import UserModel
from schemas import UserSchema
from extensions import db
import jwt
import datetime
import re

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Helper function to validate password strength
def is_strong_password(password):
    return (len(password) >= 8 and 
            any(c.isupper() for c in password) and 
            any(c.isdigit() for c in password) and 
            any(c in "!@#$%^&*()_+" for c in password))

def generate_token(user_id, role,username,image_url):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=3)
    token = jwt.encode({'user_id': user_id, 'role': role, 'username':username, 'exp': expiration_time, 'img':image_url}, config.Config.SECRET_KEY, algorithm='HS256')
     
    return token

def get_jwt_from_cookie():
    return request.cookies.get('jwt')

def decode_jwt(token):
    try:
        payload = jwt.decode(token, config.Config.SECRET_KEY, algorithms=['HS256'])
        print(payload)
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

@bp.route('/sign-up')
class SignUp(MethodView):
    @bp.arguments(UserSchema)
    def post(self, user_data):
        """Create a new user"""
        role = 'admin' if user_data['email'] == 'moussa.saja@gmail.com' else 'user'

        if not is_strong_password(user_data['password']):
            return {"error": "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."}, 400
        
        if UserModel.query.filter_by(email=user_data['email']).first():
            return {"error": "Email already exists."}, 400
        
        if UserModel.query.filter_by(username=user_data['username']).first():
            return {"error": "User  already exists. Please log in."}, 400
        

        user = UserModel(
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            username=user_data['username'],
            email=user_data['email'],
            password=user_data["password"],  # Store the hashed password
            role=role,
            image_url=user_data.get('image_url')
        )

        db.session.add(user)
        db.session.commit()

        # Generate the JWT token
        token = generate_token(user.id, role, user.username, user.image_url)

        response = make_response(jsonify({"message": "User  created successfully. Please log in."}), 201)
        response.set_cookie('jwt', token, httponly=True, secure=False, samesite='Lax')  # Set secure=True in production

        return response

@bp.route('/login')
class Login(MethodView):
    def post(self):
        """Login a user"""
        user_data = request.get_json()
        identifier = user_data.get("identifier")
        password = user_data.get("password")

        if not identifier:
            return {"error": "Username or email is required."}, 400
        
        if not password:
            return {"error": "Password is required."}, 400
        
                # Determine if identifier is email or username
        if "@" in identifier and re.match(r"[^@]+@[^@]+\.[^@]+", identifier):
            user = UserModel.query.filter_by(email=identifier).first()
        else:
            user = UserModel.query.filter_by(username=identifier).first()

        # Check if the user exists
        if not user:
            return {"error": "User  not found, try logging in again"}, 404
        
        # Check if the password is incorrect
        if user.password != password:  # Direct comparison with plain-text password
            return {"error": "Incorrect password, try again"}, 401

        # Generate token
        token = generate_token(user.id, user.role, user.username, user.image_url)

        # Create a response object
        response = make_response(jsonify({"message": "Login successful", "token": token, "username": user.username, "img":user.image_url}), 200)
        
        # Set the JWT token as a cookie
        response.set_cookie('jwt', token, httponly=True, secure=False)  # Set secure=True in production

        return response

@bp.route('/logout')
class Logout(MethodView):
    def post(self):
        """Logout a user"""
        # Clear the JWT cookie
        response = make_response(jsonify({"message": "Logout successful"}), 200)
        response.set_cookie('jwt', '', expires=0)  # Clear the cookie

        return response