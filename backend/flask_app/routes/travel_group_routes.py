from flask.views import MethodView
from flask import request, jsonify
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.travel_group import TravelGroupModel
from marshmallow import ValidationError
from schemas import TravelGroupSchema  # Import the appropriate schemas for serialization
from routes.user_routes import get_current_user, get_current_user_front
import jwt
import config
bp = Blueprint('TravelGroups', 'travelgroups', description="Operations on travel groups")

@bp.route('/travel-group/<string:group_name>')
class TravelGroupItem(MethodView):
    # Get a single travel group by group_name
    @bp.response(200, TravelGroupSchema)
    def get(self, group_name):
        travel_group = TravelGroupModel.query.filter_by(group_name=group_name).first_or_404()
        return travel_group

   
    def delete(self, group_name):
        # Fetch the travel group or raise a 404 error if not found
        travel_group = TravelGroupModel.query.filter_by(group_name=group_name).first_or_404()

        # Get the current user (assumes a function `get_current_user` exists)
        user = get_current_user()

        # Check if the user is authorized to delete the group
        if travel_group.owner_id != user.id:  # Assuming `owner_id` represents the creator of the group
            abort(403, message="You don't have permission to delete this travel group.")

        try:
            db.session.delete(travel_group)
            db.session.commit()
            return {"message": "Travel group deleted successfully."}, 200  # Explicit 200 status code
        except Exception as e:
            db.session.rollback()  # Rollback the transaction on error
            return {"message": f"An error occurred: {str(e)}"}, 500  # Return a 500 Internal Server Error



    # Update or create a travel group
    @bp.arguments(TravelGroupSchema)
    @bp.response(200, TravelGroupSchema)
    def put(self, travel_group_data, group_name):
        # Attempt to fetch the existing group
        travel_group = TravelGroupModel.query.filter_by(group_name=group_name).first()

        if travel_group:
            # Update existing travel group with new data
            travel_group.group_name = travel_group_data["group_name"]
            travel_group.destination = travel_group_data["destination"]
            travel_group.start_date = travel_group_data["start_date"]
            travel_group.end_date = travel_group_data["end_date"]
            travel_group.description = travel_group_data["description"]
            travel_group.contact_info = travel_group_data["contact_info"]
        else:
            # If the group doesn't exist, create a new one
            travel_group = TravelGroupModel(group_name=group_name, **travel_group_data)
            db.session.add(travel_group)

        db.session.commit()
        return travel_group

@bp.route('/travel-group')
class TravelGroupList(MethodView):
    @bp.response(200, TravelGroupSchema(many=True))
    def get(self):
        # Extract query parameters
        group_name = request.args.get('group_name')
        destination = request.args.get('destination')
        start_date = request.args.get('start_date')  
        end_date = request.args.get('end_date')      

        # Start building the query
        query = TravelGroupModel.query

        if destination:
            query = query.filter(TravelGroupModel.destination.ilike(f"%{destination}%"))
        if start_date:
            # Validate and use the date string directly for filtering
            query = query.filter(TravelGroupModel.start_date >= start_date)
        if end_date:
            # Validate and use the date string directly for filtering
            query = query.filter(TravelGroupModel.end_date <= end_date)
        if group_name:
            query = query.filter(TravelGroupModel.group_name.ilike(f"%{group_name}%"))

        # Fetch and return results
        groups = query.all()
        # Fetch and return results
        group = [{
            "group_name" : group.group_name ,
            "destination" : group.destination,
            "start_date" : group.start_date, 
            "end_date" : group.end_date 
        } for group in groups]
        return group

    @bp.arguments(TravelGroupSchema)
    @bp.response(201, TravelGroupSchema)
    def post(self, travel_group_data):
        token = request.headers.get('Authorization')
    
        # Determine how to handle user authentication
        if token:
            try:
                token = token.split()[1]  # Extract the token
                current_user = get_current_user_front(token)  # Front-end-specific token handling
            except (IndexError, Exception) as e:
                abort(401, message="Invalid or expired token")  # Handle token parsing or expiry issues
        else:
            # No token provided (for testing or Postman)
            current_user = get_current_user()  # Fallback to default or testing user
    
        if not current_user:
            abort(401, message="Unauthorized access")  # If no valid user, return unauthorized access
    
        # Create the TravelGroup instance from the data
        travel_group = TravelGroupModel(**travel_group_data)
        
        travel_group.creator_id = current_user.id
        # Add the current user as a member to the group
        travel_group.add_member(current_user.username)
        try:
            db.session.add(travel_group)  # Add the group to the session
            db.session.commit()  # Commit to the database
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback the session in case of error
            print(f"Error details: {e}")
            abort(500, message="An error occurred while creating the travel group.")
        
        return travel_group 



@bp.route('/travel-group/<string:group_name>/<string:action>', methods=['PATCH'])
def join_leave_group(group_name, action):
    token = request.headers.get('Authorization')
    token = token.split()[1]
    group = TravelGroupModel.query.filter_by(group_name=group_name).first()
    if not group:
        abort(404, message="Group not found")

    user = get_current_user_front(token)  
    if not isinstance(group.members, list):
        group.members = []  # Initialize it as a list if it isn't

    # Log members before modifying (for debugging)
    print(f"Current members before action: {group.members}")
    print(f"Group type: {type(group)}")

    if action == 'join':
        if user.username not in group.members:
            group.add_member(user.username) 
            try:
                db.session.commit()
            except Exception as e:
                print(f"Error committing to the database: {e}")
                db.session.rollback()  # Rollback the session in case of error
        else:
            abort(400, message="You are already a member of the group.")
    
    elif action == 'leave':
        
        if user.username in group.members:
            group.remove_member(user.username)  # Remove the user from the members list
            db.session.commit() 
        else:
            abort(400, message="You are not a member of the group.")
    
    # Serialize the group data using the schema
    group_schema = TravelGroupSchema()
    result = group_schema.dump(group)
    
    return jsonify(result)  # Return the serialized result as JSON




#@bp.route('/travel-group/<int:group_id>/members')
#class TravelGroupMembers(MethodView):
#    @bp.response(200, GroupMemberSchema(many=True))
#    def get(self, group_id):
#        members = GroupMemberModel.query.filter_by(group_id=group_id).all()
#        return members
#
#
#@bp.route('/travel-group/<int:group_id>/leave')
#class LeaveTravelGroup(MethodView):
#    @bp.arguments(GroupMemberSchema)
#    def post(self, group_member_data, group_id):
#        group_member = GroupMemberModel.query.filter_by(group_id=group_id, user_id=group_member_data['user_id']).first_or_404()
#        db.session.delete(group_member)
#        db.session.commit()
#        return {"message": "You have successfully left the group."}