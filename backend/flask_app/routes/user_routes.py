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
        abort(400, message="Token is missing.")

    try:
        decoded_token = jwt.decode(token, config.Config.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        if not user_id:
            abort(400, message="User ID is missing in token.")
        user = UserModel.query.get(user_id)  
        if not user:
            abort(404, message="User not found.")
        return user  
    except jwt.ExpiredSignatureError:
        abort(401, message="Token has expired.")
    except jwt.InvalidTokenError:
        abort(401, message="Token is invalid.")

def get_current_user():
    
    token = request.cookies.get('jwt') 
    if not token:
        abort(401, message="Token is missing.")

    try:
        decoded_token = jwt.decode(token, config.Config.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token.get('user_id')
        user = UserModel.query.get(user_id)  
        if not user:
            abort(404, message="User  not found.")
        return user  
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
            abort(403, message="You don't have permission to access this resource.")

        return UserSchema(many=True).dump(UserModel.query.all()), 200

@bp.route('/<string:username>')
class UserDetail(MethodView):
    @bp.response(200, UserSchema)
    def get(self, username):
        token = request.headers.get('Authorization')

        if token:
            try:
                token = token.split()[1]
                current_user = get_current_user_front(token)  
            except Exception as e:
                abort(401, message="Invalid or expired token")
        else:
            current_user = get_current_user()  

        if not current_user:
            abort(401, message="Unauthorized access")

        user = UserModel.query.filter_by(username=username).first_or_404()

        if current_user.username != username and current_user.role != "admin":
            return UserSchema(exclude=("password", "id", "role")).dump(user), 200

        return UserSchema().dump(user), 200




    def delete(self, username):
        """Delete a user by username"""
        token = request.headers.get('Authorization')

        if token:
            try:
                token = token.split()[1]
                current_user = get_current_user_front(token)  
            except Exception as e:
                abort(401, message="Invalid or expired token")
        else:
            current_user = get_current_user()  

        if not current_user:
            abort(401, message="Unauthorized access")
        if current_user.username != username and current_user.role != "admin":
            abort(403, message="Permission denied.")
        
        db.session.delete(current_user)
        db.session.commit()
        return {"message": "User  deleted successfully."}

    
    @bp.arguments(UserSchema)  
    @bp.response(200, UserSchema)
    def put(self, user_data, username):
        """Update an existing user by username"""
        user = UserModel.query.filter_by(username=username).first()

        if not user:
            abort(404, message="User  not found")
        
        password = user_data.get("password")
        if password and user.password != password:
            abort(400, message="Current password is incorrect")

        
        if 'username' in user_data:
            if UserModel.query.filter_by(username=user_data['username']).first() and user_data['username'] != user.username:
                abort(400, message="Username already exists")
            user.username = user_data['username']

        
        new_password = user_data.get("new_password")
        if new_password:
            if not is_strong_password(new_password):
                abort(400, message="New password is not strong enough.")
            user.password = new_password

       
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

        if updated_fields or new_password:
            db.session.commit()
            user_data = UserSchema(exclude=["password"]).dump(user) 
            if new_password:
                user_data["password"] = new_password 

            return jsonify(user_data)
        else:
            abort(400, message="No fields were provided for update.")