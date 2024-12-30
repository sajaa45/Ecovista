from flask.views import MethodView
from flask import request
from flask_smorest import Blueprint, abort
from extensions import db
from models.user import UserModel
from schemas import UserSchema
from uuid import uuid4
from werkzeug.security import check_password_hash
#current_user = get_jwt_identity()
bp = Blueprint('users', __name__, url_prefix='/users')



@bp.route('/')
class UserList(MethodView):
    @bp.response(200, UserSchema(many=True))
    def get(self):
        """Get all users"""
        # Ensure the user is an admin before showing all users
        if request.args.get("role") != "admin":
            # Non-admin users only see specific fields
            users = UserModel.query.all()
            return UserSchema(many=True, exclude=("password","id", "role")).dump(users), 200
        
        return UserModel.query.all()

    



@bp.route('/<string:username>')
class UserDetail(MethodView):
    @bp.response(200, UserSchema)
    def get(self, username):
        """Get a single user by username"""
        user = UserModel.query.filter_by(username=username).first_or_404()

        # Check if the current user is an admin or the user themselves
        current_user = request.args.get('current_user')  # Adjust this based on how you fetch the logged-in user
        
        # If the current user is neither an admin nor the target user, limit data visibility
        if current_user != username and current_user != "admin":
            # Return only the first_name, last_name, email, and username for non-admin users
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
        
        current_user = request.args.get('current_user')  # Adjust this based on how you fetch the logged-in user
        
        #  only the admin or the user himself can delete the account
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
        user.image=user_data['image_url']
        db.session.commit()
        
        return user