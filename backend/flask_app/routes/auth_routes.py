from flask.views import MethodView
import config
from flask import request, session, jsonify, abort
from flask_smorest import Blueprint
from werkzeug.security import check_password_hash
from models.user import UserModel
from schemas import UserSchema
from extensions import db
import jwt
import datetime
import re


bp = Blueprint('auth', __name__, url_prefix='/auth')

# Helper function to validate password strength
def is_strong_password(password):
    # Implement your password validation logic here
    return len(password) >= 8 and any(c.isupper() for c in password) and any(c.isdigit() for c in password) and any(c in "!@#$%^&*()_+" for c in password)

def generate_token(user_id, role):
    # Example: Create a token that expires in 1 hour
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({'user_id': user_id, 'role':role ,'exp': expiration_time}, config.Config.SECRET_KEY, algorithm='HS256')
    
    return token

@bp.route('/sign-up')
class SignUp(MethodView):
    @bp.arguments(UserSchema)
    def post(self, user_data):
        """Create a new user"""
        # Set the role based on email address
        role = 'admin' if user_data['email'] == 'moussa.saja@gmail.com' else 'user'

        # Check if password is strong
        if not is_strong_password(user_data['password']):
            return {"error":"Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."},400
        # Check if email already exists
        if UserModel.query.filter_by(email=user_data['email']).first():
            return {"error": "Email already exists."}, 400
        
        # Check if the user already exists
        if UserModel.query.filter_by(username=user_data['username']).first():
            return {"error": "User already exists. Please log in."}, 400
        # Create the user
        user = UserModel(
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'], 
            role=role,
            image_url=user_data.get('image_url')  # Use get to avoid KeyError if not provided
        )
        token = generate_token(user.id, role)

        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created successfully. Please log in.", "token":token}), 201

@bp.route('/login')
class Login(MethodView):
    def post(self):
        """Login a user"""
        # Get the user data from the JSON request body
        user_data = request.get_json()

        # Extract identifier and password
        identifier = user_data.get("identifier")  # Unified identifier field
        password = user_data.get("password")

        # Debug: Print received data
        print(f"Received Identifier: {identifier}, Password: {password}")

        # Validate identifier
        if not identifier :
            return {"error": "Username or email is required."}, 400
        # Validate inputs
        if not password:
            return {"error": "Password is required."}, 400
        # Determine if identifier is email or username
        if "@" in identifier and re.match(r"[^@]+@[^@]+\.[^@]+", identifier):
            user = UserModel.query.filter_by(email=identifier).first()
        else:
            user = UserModel.query.filter_by(username=identifier).first()

        # Check if the user exists
        if not user:
            return {"error": "User not found, try logging in again"}, 404
        
        # Check if the password is incorrect
        if user.password != password:  # Direct comparison with plain-text password
            return {"error": "Incorrect password, try again"}, 401

        # Generate token and set session data
        token = generate_token(user.id, user.role)
        session['user_id'] = user.id
        session['username'] = user.username

        # Return success response
        return jsonify({"message": "Login successful", "token": token}), 200

@bp.route('/logout')
class Logout(MethodView):
    def post(self):
        """Logout a user"""
        # Clear session
        session.pop('user_id', None)
        session.pop('username', None)
        session.pop('role', None)
        
        return jsonify({"message": "Logout successful"}), 200
