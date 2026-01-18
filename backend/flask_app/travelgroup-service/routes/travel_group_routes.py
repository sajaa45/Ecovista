from flask.views import MethodView
from flask import request, jsonify
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.travel_group import TravelGroupModel
from models.destination import DestinationModel
from schemas import TravelGroupSchema  
from routes.user_routes import get_current_user, get_current_user_front
bp = Blueprint('TravelGroups', 'travelgroups', description="Operations on travel groups")

@bp.route('/travel-group/<string:group_name>')
class TravelGroupItem(MethodView):
    @bp.response(200, TravelGroupSchema)
    def get(self, group_name):
        travel_group = TravelGroupModel.query.filter_by(group_name=group_name).first_or_404()
        return travel_group

   
    def delete(self, group_name):
        travel_group = TravelGroupModel.query.filter_by(group_name=group_name).first_or_404()

        try:
            db.session.delete(travel_group)
            db.session.commit()
            return {"message": "Travel group deleted successfully."}, 200 
        except Exception as e:
            db.session.rollback()  
            abort(500, message=f"An error occurred: {str(e)}")



    @bp.arguments(TravelGroupSchema)
    @bp.response(200, TravelGroupSchema)
    def put(self, travel_group_data, group_name):
        token = request.headers.get('Authorization')
        if token:
            try:
                token = token.split()[1]  # Extract the token
                current_user = get_current_user_front(token)  # Front-end-specific token handling
            except (IndexError, Exception) as e:
                abort(401, message=f"Invalid or expired token: {str(e)}")  # Log token errors
        else:
            current_user = get_current_user()
        if not current_user:
            abort(401, message="Unauthorized access")
        
        required_fields = ["group_name", "destination", "start_date", "end_date", "contact_info"]
        for field in required_fields:
            if not travel_group_data.get(field):
                abort(400, message=f"{field.replace('_', ' ').capitalize()} field is required.")

        duplicate_group = TravelGroupModel.query.filter(
            TravelGroupModel.group_name == travel_group_data["group_name"],
            TravelGroupModel.group_name != group_name
        ).first()
        if duplicate_group:
            abort(400, message=f"A travel group with the name '{travel_group_data['group_name']}' already exists.")
        
        destination_name = travel_group_data["destination"].strip()
        destination = DestinationModel.query.filter_by(name=destination_name.lower()).first()
        if not destination:
            abort(404, message=f"The destination '{destination_name}' was not found.")
        
        travel_group = TravelGroupModel.query.filter_by(group_name=group_name).first()
        if not travel_group:
            abort(404, message=f"Travel group with name '{group_name}' not found.")

        travel_group.group_name = travel_group_data["group_name"]
        travel_group.destination = travel_group_data["destination"]
        travel_group.start_date = travel_group_data["start_date"]
        travel_group.end_date = travel_group_data["end_date"]
        travel_group.description = travel_group_data.get("description", travel_group.description)
        travel_group.contact_info = travel_group_data["contact_info"]
        travel_group.creator_id = current_user.id

        try:
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"SQLAlchemy Error: {e}")  
            abort(500, message="An error occurred while saving the travel group.")

        return travel_group

@bp.route('/travel-group')
class TravelGroupList(MethodView):
    @bp.response(200, TravelGroupSchema(many=True))
    def get(self):
        group_name = request.args.get('group_name')
        destination = request.args.get('destination')
        start_date = request.args.get('start_date')  
        end_date = request.args.get('end_date')      

        query = TravelGroupModel.query

        if destination:
            query = query.filter(TravelGroupModel.destination.ilike(f"%{destination}%"))
        if start_date:
            query = query.filter(TravelGroupModel.start_date >= start_date)
        if end_date:
            query = query.filter(TravelGroupModel.end_date <= end_date)
        if group_name:
            query = query.filter(TravelGroupModel.group_name.ilike(f"%{group_name}%"))

        groups = query.all()
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

        if token:
            try:
                token = token.split()[1] 
                current_user = get_current_user_front(token)  
            except (IndexError, Exception) as e:
                abort(401, message="Invalid or expired token") 
        else:
            current_user = get_current_user()  

        if not current_user:
            abort(401, message="Unauthorized access")  

        travel_group_data['group_name'] = travel_group_data['group_name'].strip()
        if not travel_group_data['group_name']:
            abort(400, message="Group name field is required.")

        duplicate_group = TravelGroupModel.query.filter_by(group_name=travel_group_data['group_name']).first()
        if duplicate_group:
            abort(400, message=f"A travel group with the name '{travel_group_data['group_name']}' already exists. Please choose a different name.")

        travel_group_data['destination'] = travel_group_data['destination'].strip()
        if not travel_group_data['destination']:
            abort(400, message="Destination field is required.")

        destination_name = travel_group_data['destination']
        destination = DestinationModel.query.filter_by(name=destination_name.lower()).first()
        if not destination:
            abort(404, message=f"The destination '{destination_name}' was not found.")

        travel_group = TravelGroupModel(**travel_group_data)
        travel_group.creator_id = current_user.id

        travel_group.add_member(current_user.username)

        try:
            db.session.add(travel_group)  
            db.session.commit()  
        except SQLAlchemyError as e:
            db.session.rollback() 
            print(f"Error details: {e}")
            abort(500, message="An error occurred while creating the travel group.")

        return travel_group



@bp.route('/travel-group/<string:group_name>/<string:action>', methods=['PATCH'])
def join_leave_group(group_name, action):
    token = request.headers.get('Authorization')
    if token:
        try:
            token = token.split()[1]  
            current_user = get_current_user_front(token)  
        except (IndexError, Exception) as e:
            abort(401, message="Invalid or expired token")  
    else:
        current_user = get_current_user() 
    if not current_user:
            abort(401, message="Unauthorized access") 

    group = TravelGroupModel.query.filter_by(group_name=group_name).first()
    if not group:
        abort(404, message="Group not found")

    if not isinstance(group.members, list):
        group.members = []  


    if action == 'join':
        if current_user.username not in group.members:
            group.add_member(current_user.username) 
            try:
                db.session.commit()
            except Exception as e:
                print(f"Error committing to the database: {e}")
                db.session.rollback()  
        else:
            abort(400, message="You are already a member of the group.")
    
    elif action == 'leave':
        
        if current_user.username in group.members:
            group.remove_member(current_user.username) 
            db.session.commit() 
        else:
            abort(400, message="You are not a member of the group.")
    
    group_schema = TravelGroupSchema()
    result = group_schema.dump(group)
    
    return jsonify(result)  



