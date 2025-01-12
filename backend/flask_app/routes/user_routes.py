from flask.views import MethodView
from flask import request, jsonify
from flask_smorest import Blueprint, abort
from extensions import db
from models.user import UserModel
from schemas import UserSchema
import jwt
import config

bp = Blueprint('users', __name__, url_prefix='/users')

def get_current_user(token):
    token = request.cookies.get('jwt') 
    if not token:
        abort(401, message="Token is missing.")

    try:
        decoded_token = jwt.decode(token, config.Config.SECRET_KEY, algorithms=['HS256'])
        print(decoded_token)
        user_id = decoded_token.get('user_id')
        user = UserModel.query.get(user_id)  # Fetch user from the database
        if not user:
            abort(404, message="User  not found.")
        return user  # Return the user object
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
        if current_user.role != "admin":
            # Non-admin users only see specific fields
            users = UserModel.query.all()
            return UserSchema(many=True, exclude=("password", "id", "role")).dump(users), 200

        # Admin users can see all user data
        return UserSchema(many=True).dump(UserModel.query.all()), 200

@bp.route('/<string:username>')
class UserDetail(MethodView):
    @bp.response(200, UserSchema)
    def get(self, username):
        """Get a single user by username"""
        user = UserModel.query.filter_by(username=username).first_or_404()
        print(f"User found: {user.username}")
        # Get the current logged-in user from the JWT token
        # get_current_user()  # This will return the user object
        if not username:
            abort(401, message="Username missing")

        # Check if the current user is an admin or the user themselves
        #if current_user.username != username and current_user.role != "admin":
            # Non-admin users only see specific fields
        
            # Admins or the user themselves can see all data
        user_data = UserSchema().dump(user)
        print(f"Current user: {user_data}") 
        return user_data

    def delete(self, username):
        """Delete a user by username"""
        user = UserModel.query.filter_by(username=username).first_or_404()

        current_user = get_current_user()  # Get the current logged-in user from the JWT token
        
        # Only the admin or the user themselves can delete the account
        if current_user.username != username and current_user.role != "admin":
            abort(403, message="Permission denied.")
        
        db.session.delete(user)
        db.session.commit()
        return {"message": "User  deleted successfully."}

    @bp.arguments(UserSchema)
    @bp.response(200, UserSchema)
    def put(self, user_data, username):
        """Update an existing user by username"""
        # Fetch the user by the provided username
        user = UserModel.query.filter_by(username=username).first()

        if not user:
            abort(404, message="User  not found")
        
        # Verify the current password provided by the user
        if user.password != user_data.get('current_password'):
            abort(400, message="Current password is incorrect")

        # Check if the new username already exists in the database
        if 'username' in user_data and UserModel.query.filter_by(username=user_data['username']).first():
            abort(400, message="Username already exists")

        if 'username' in user_data:
            user.username = user_data['username']
        
        user.first_name = user_data['first_name']
        user.last_name = user_data['last_name']
        user.email = user_data['email']
        user.image_url = user_data['image_url']  # Corrected to match the attribute name
        db.session.commit()
        
        return UserSchema().dump(user)  # Return the updated user data

#@bp.route('/me')
#class CurrentUser (MethodView):
#    def get(self):
#        """Get the current user's information"""
#        user = get_current_user()  # Get the current user based on the token
#        user_data = UserSchema().dump(user)  # Serialize the user data using UserSchema
#        return jsonify(user_data)  # Return the user data as JSON