from flask.views import MethodView
from flask import request, session, jsonify, abort
from flask_smorest import Blueprint
from werkzeug.security import check_password_hash
from models.user import UserModel
from schemas import UserSchema
from extensions import db

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Helper function to validate password strength
def is_strong_password(password):
    # Implement your password validation logic here
    return len(password) >= 8 and any(c.isupper() for c in password) and any(c.isdigit() for c in password) and any(c in "!@#$%^&*()_+" for c in password)

@bp.route('/sign-up')
class SignUp(MethodView):
    @bp.arguments(UserSchema)
    def post(self, user_data):
        """Create a new user"""
        # Set the role based on email address
        role = 'admin' if user_data['email'] == 'moussa.saja@gmail.com' else 'user'

        # Check if password is strong
        if not is_strong_password(user_data['password']):
            abort(400, message="Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.")

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

        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User created successfully. Please log in."}), 201

@bp.route('/login')
class Login(MethodView):
    def post(self):
        """Login a user"""
        # Get the user data from the JSON request body
        user_data = request.get_json()
        
        # Extract identifier (either username or email) and password
        identifier = user_data.get("username") or user_data.get("email")  # Accept either username or email
        password = user_data.get("password")
        
        if not identifier or not password:
            return {"error":"Username or email and password are required."}, 400

        # Find the user by either username or email
        user = UserModel.query.filter((UserModel.username == identifier) | (UserModel.email == identifier)).first()
        
        # Check if user exists and if password is correct (without hashing)
        if not user or user.password != password:  # Direct comparison with plain-text password
            return {"error": "Invalid credentials"}, 401
        
        # Set session data on successful login
        session['user_id'] = user.id
        session['username'] = user.username
        session['role'] = user.role  

        return jsonify({"message": "Login successful"}), 200

@bp.route('/logout')
class Logout(MethodView):
    def post(self):
        """Logout a user"""
        # Clear session
        session.pop('user_id', None)
        session.pop('username', None)
        session.pop('role', None)
        
        return jsonify({"message": "Logout successful"}), 200
