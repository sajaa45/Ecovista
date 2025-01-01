from flask.views import MethodView
from flask import request
from flask_smorest import Blueprint, abort
from extensions import db
from models.user import UserModel
from schemas import UserSchema
from uuid import uuid4
from werkzeug.security import check_password_hash
import jwt
import config 
#current_user = get_jwt_identity()
bp = Blueprint('users', __name__, url_prefix='/users')




def get_current_user():
    token = request.headers.get('Authorization')  # Get token from 'Authorization' header
    if token:
        print(f"Received token: {token}")
    else:
        print("Token is missing.")
    
    try:
        # Remove the 'Bearer ' prefix
        token = token.split(" ")[1]
        decoded_token = jwt.decode(token, config.Config.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        role = decoded_token.get('role') 
        return role
    except jwt.ExpiredSignatureError:
        abort(401, message="Token has expired.")
    except jwt.InvalidTokenError:
        abort(401, message="Token is invalid.")



@bp.route('/')
class UserList(MethodView):
    @bp.response(200, UserSchema(many=True))
    def get(self):
        """Get all users"""
        current_user = get_current_user() 
        # Ensure the user is an admin before showing all users
        if current_user != "admin":
            # Non-admin users only see specific fields
            users = UserModel.query.all()
            return UserSchema(many=True, exclude=("password", "id", "role")).dump(users), 200

        # Admin users can see all user data
        return UserModel.query.all()


@bp.route('/<string:username>')
class UserDetail(MethodView):
    @bp.response(200, UserSchema)
    def get(self, username):
        """Get a single user by username"""
        user = UserModel.query.filter_by(username=username).first_or_404()
        
        # Get the current logged-in user from the JWT token
        current_user = get_current_user()  # This will return 'username' from JWT

        # Check if the current user is an admin or the user themselves
        if current_user != username and current_user != "admin":
            # Non-admin users only see specific fields
            user_data = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "image": user.image_url
            }
        else:
            # Admins or the user themselves can see all data
            user_data = UserSchema().dump(user)

        return user_data

    def delete(self, username):
        """Delete a user by username"""
        user = UserModel.query.filter_by(username=username).first_or_404()

        current_user = get_current_user()  # Get the current logged-in user from the JWT token
        
        # Only the admin or the user themselves can delete the account
        if current_user != username and current_user != "admin":
            abort(403, message="Permission denied.")
        
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully."}

    @bp.arguments(UserSchema)
    @bp.response(200, UserSchema)
    def put(self, user_data, username):
        """Update an existing user by username"""
        # Fetch the user by the provided username
        user = UserModel.query.filter_by(username=username).first()

        if not user:
            abort(404, message="User not found")
        
        # Verify the current password provided by the user
        if not check_password_hash(user.password, user_data.get('current_password')):
            abort(400, message="Current password is incorrect")

        # Check if the new username already exists in the database
        if 'username' in user_data and UserModel.query.filter_by(username=user_data['username']).first():
            abort(400, message="Username already exists")

        if 'username' in user_data:
            user.username = user_data['username']
        
        user.first_name = user_data['first_name']
        user.last_name = user_data['last_name']
        user.email = user_data['email']
        user.image = user_data['image_url']
        db.session.commit()
        
        return user
