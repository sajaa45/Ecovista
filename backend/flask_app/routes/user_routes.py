from flask.views import MethodView
from flask import request, jsonify
from flask_smorest import Blueprint, abort
from extensions import db
from models.user import UserModel
from schemas import UserSchema
from .auth_routes import is_strong_password
import jwt
import config

bp = Blueprint('users', __name__, url_prefix='/users')
def get_current_user_front(token):
    
    if not token:
        print("Token is missing.")

    try:
        decoded_token = jwt.decode(token, config.Config.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        if not user_id:
            print("User ID is missing in token.")
        user = UserModel.query.get(user_id)  # Fetch user from the database
        if not user:
            print("User not found.")
        return user  # Return the user object
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
    except jwt.InvalidTokenError:
        print("Token is invalid.")

def get_current_user():
    
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
        token = request.headers.get('Authorization')

        if token:
            # Token provided (e.g., from the front-end)
            try:
                token = token.split()[1]
                current_user = get_current_user_front(token)  # Front-end-specific token handling
            except Exception as e:
                abort(401, message="Invalid or expired token")
        else:
            # No token provided (e.g., for Postman testing)
            current_user = get_current_user()  # Default or testing user

        if not current_user:
            abort(401, message="Unauthorized access")

        print(f"Current user: {current_user.username}")

        # Get the requested user by username
        user = UserModel.query.filter_by(username=username).first_or_404()
        print(f"User found: {user.username}")

        # If the current user is not an admin or the requested user, restrict fields
        if current_user.username != username and current_user.role != "admin":
            return UserSchema(exclude=("password", "id", "role")).dump(user), 200

        # Admins or the user themselves can view all fields
        return UserSchema().dump(user), 200




    def delete(self, username):
        """Delete a user by username"""
        token = request.headers.get('Authorization')

        if token:
            # Token provided (e.g., from the front-end)
            try:
                token = token.split()[1]
                current_user = get_current_user_front(token)  # Front-end-specific token handling
            except Exception as e:
                abort(401, message="Invalid or expired token")
        else:
            # No token provided (e.g., for Postman testing)
            current_user = get_current_user()  # Default or testing user

        if not current_user:
            abort(401, message="Unauthorized access")
        # Only the admin or the user themselves can delete the account
        if current_user.username != username and current_user.role != "admin":
            abort(403, message="Permission denied.")
        
        db.session.delete(current_user)
        db.session.commit()
        return {"message": "User  deleted successfully."}

    
    @bp.arguments(UserSchema)  # Only validate fields defined in UserSchema
    @bp.response(200, UserSchema)
    def put(self, user_data, username):
        """Update an existing user by username"""
        # Fetch the user from the database
        user = UserModel.query.filter_by(username=username).first()

        if not user:
            abort(404, message="User  not found")

        # Handle password verification
        password = user_data.get("password")  # This is now the current password

        # Verify the current password provided by the user
        if password and user.password != password:
            abort(400, message="Current password is incorrect")

        # Update the username if provided and it's available
        if 'username' in user_data:
            # Check if the new username already exists
            if UserModel.query.filter_by(username=user_data['username']).first() and user_data['username'] != user.username:
                abort(400, message="Username already exists")
            user.username = user_data['username']

        # Update the password if a new one is provided
        new_password = user_data.get("new_password")
        if new_password:
            # Validate the new password strength
            if not is_strong_password(new_password):
                abort(400, message="New password is not strong enough.")
            user.password = new_password

        # Update other fields
        updated_fields = False

        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
            updated_fields = True

        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
            updated_fields = True

        if 'email' in user_data:
            user.email = user_data['email']
            updated_fields = True

        if 'image_url' in user_data:
            user.image_url = user_data['image_url']
            updated_fields = True

        # Commit the changes to the database if any fields were updated
        if updated_fields or new_password:
            db.session.commit()

            # Return the updated user data, excluding the current password
            user_data = UserSchema(exclude=["password"]).dump(user)  # Exclude password from response

            # If new password was set, add it to the response
            if new_password:
                user_data["password"] = new_password  # Include the new password if provided

            return jsonify(user_data)
        else:
            abort(400, message="No fields were provided for update.")