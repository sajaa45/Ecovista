from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request
from extensions import db
from models.activity import ActivityModel
from models.destination import DestinationModel  
from marshmallow import ValidationError
from schemas import ActivitySchema, DestinationSchema
from routes.user_routes import get_current_user, get_current_user_front
bp = Blueprint('Activities', 'activity', description="Operations on activities")

@bp.route('/activity/<string:name>')
class ActivityItem(MethodView):
    @bp.response(200, ActivitySchema)
    def get(self, name):
        activity = ActivityModel.query.filter_by(name=name).first_or_404()
        return activity

    def delete(self, name):
        activity = ActivityModel.query.filter_by(name=name).first_or_404()
        db.session.delete(activity)
        db.session.commit()
        return {"message": "Activity deleted successfully.", "Activity Name": name}

    @bp.arguments(ActivitySchema)
    @bp.response(200, ActivitySchema)
    def put(self, activity_data, name):
        activity = ActivityModel.query.filter_by(name=name).first_or_404()
        
        if activity_data.get('name', activity.name) != activity.name and ActivityModel.query.filter_by(name=activity_data.get('name')).first():
            abort(400, message="Activity with this name already exists.")

        activity.name = activity_data["name"]
        activity.description = activity_data.get("description")
        activity.duration = activity_data["duration"]
        activity.max_participants = activity_data["max_participants"]
        new_destination_names = activity_data.get("destinations", [])

        if not isinstance(new_destination_names, list) or not all(isinstance(name, str) for name in new_destination_names):
            abort(400, message="Destinations must be a list of strings.")
        new_destination_names_lower = [name.lower() for name in new_destination_names]

        destinations = DestinationModel.query.filter(
            DestinationModel.name.in_(new_destination_names_lower)
        ).all()

        found_destination_names = {destination.name.lower() for destination in destinations}
        missing_destinations = set(new_destination_names_lower) - found_destination_names

        if missing_destinations:
            missing_destinations_original_case = [
                name for name in new_destination_names if name.lower() in missing_destinations
            ]
            abort(404, message=f"These destinations were not found: {', '.join(missing_destinations_original_case)}.")

        if len(set(new_destination_names_lower)) != len(new_destination_names):
            abort(400, message="Duplicate destination names are not allowed.")

        activity.destinations = new_destination_names 
        activity.name = activity_data.get("name", activity.name)  
        activity.description = activity_data.get("description", activity.description)  
        activity.duration = activity_data.get("duration", activity.duration)  
        activity.max_participants = activity_data.get("max_participants", activity.max_participants)  
        db.session.commit()
        return activity


@bp.route('/activity')
class ActivityList(MethodView):
    @bp.response(200, ActivitySchema(many=True))
    def get(self):
        activities = ActivityModel.query.all()
        result=[{
            'name': activity.name,
            'description': activity.description,
            'duration': activity.duration
        } for activity in activities]
        return result

    @bp.arguments(ActivitySchema)
    @bp.response(201, ActivitySchema)
    def post(self, activity_data):
        
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
        print(f"Current user ID: {current_user.id}")

        destination_names = activity_data.get("destinations", [])

        if not isinstance(destination_names, list) or not all(isinstance(name, str) for name in destination_names):
            abort(400, message="Destinations must be a list of strings.")

        destination_names_lower = [name.lower() for name in destination_names]

        destinations = DestinationModel.query.filter(
            DestinationModel.name.in_(destination_names_lower)
        ).all()

        found_destination_names = {destination.name.lower() for destination in destinations}
        missing_destinations = set(destination_names_lower) - found_destination_names

        if missing_destinations:
            missing_destinations_original_case = [
                name for name in destination_names if name.lower() in missing_destinations
            ]
            abort(404, message=f"These destinations were not found: {', '.join(missing_destinations_original_case)}.")

        activity_name = activity_data.get("name")
        existing_activity = ActivityModel.query.filter_by(name=activity_name).first()
        if existing_activity:
            abort(400, message=f"An activity with the name '{activity_name}' already exists.")

        activity = ActivityModel(
            name=activity_data["name"],
            description=activity_data.get("description"),
            duration=activity_data["duration"],
            max_participants=activity_data["max_participants"],
            destinations=destination_names,  
            creator_id=current_user.id
        )

        db.session.add(activity)
        db.session.commit()

        return activity