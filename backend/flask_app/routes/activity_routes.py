from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request
from extensions import db
from models.activity import ActivityModel
from models.destination import DestinationModel  # Import Destination model to query destinations
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
        # Fetch the activity by ID and delete
        activity = ActivityModel.query.get_or_404(name)
        db.session.delete(activity)
        db.session.commit()
        return {"message": "Activity deleted successfully.", "Activity Name": name}

    @bp.arguments(ActivitySchema)
    @bp.response(200, ActivitySchema)
    def put(self, activity_data, name):
        # Fetch the activity by name
        activity = ActivityModel.query.filter_by(name=name).first_or_404()
        
        # Check if the activity name already exists in the database (if different from the current one)
        if activity_data.get('name', activity.name) != activity.name and ActivityModel.query.filter_by(name=activity_data.get('name')).first():
            abort(400, message="Activity with this name already exists.")

        # Update activity details
        activity.name = activity_data["name"]
        activity.description = activity_data.get("description")
        activity.duration = activity_data["duration"]
        activity.max_participants = activity_data["max_participants"]

        # Get the list of destination names from the request
        new_destination_names = activity_data.get("destinations", [])

        # Validate that the new_destination_names is a list of strings
        if not isinstance(new_destination_names, list) or not all(isinstance(name, str) for name in new_destination_names):
            abort(400, message="Destinations must be a list of strings.")

        # Convert destination names to lowercase for case-insensitive comparison
        new_destination_names_lower = [name.lower() for name in new_destination_names]

        # Query the database to check if the destinations exist
        destinations = DestinationModel.query.filter(
            DestinationModel.name.in_(new_destination_names_lower)
        ).all()

        # Check for any missing destinations
        found_destination_names = {destination.name.lower() for destination in destinations}
        missing_destinations = set(new_destination_names_lower) - found_destination_names

        if missing_destinations:
            missing_destinations_original_case = [
                name for name in new_destination_names if name.lower() in missing_destinations
            ]
            abort(404, message=f"These destinations were not found: {', '.join(missing_destinations_original_case)}.")

        # Ensure no duplicate destination names
        if len(set(new_destination_names_lower)) != len(new_destination_names):
            abort(400, message="Duplicate destination names are not allowed.")

        # Update the activity's destinations
        activity.destinations = new_destination_names 
        activity.name = activity_data.get("name", activity.name)  # Update name if provided
        activity.description = activity_data.get("description", activity.description)  # Update description if provided
        activity.duration = activity_data.get("duration", activity.duration)  # Update duration if provided
        activity.max_participants = activity_data.get("max_participants", activity.max_participants)  # Update max_participants
        db.session.commit()
        # Commit the changes t
            # Return the updated activity
        return activity


@bp.route('/activity')
class ActivityList(MethodView):
    @bp.response(200, ActivitySchema(many=True))
    def get(self):
        # Get all activities
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
                token = token.split()[1]  # Extract the token
                current_user = get_current_user_front(token)  # Front-end-specific token handling
            except (IndexError, Exception) as e:
                abort(401, message="Invalid or expired token")  # Handle token parsing or expiry issues
        else:
            # No token provided (for testing or Postman)
            current_user = get_current_user()  # Fallback to default or testing user

        if not current_user:
            abort(401, message="Unauthorized access")  # If no valid user, return unauthorized access

        # Debug print for user info (can be removed later)
        print(f"Current user ID: {current_user.id}")

        # Extract the destination names from the request data
        destination_names = activity_data.get("destinations", [])

        # Check if destination_names is a list of strings
        if not isinstance(destination_names, list) or not all(isinstance(name, str) for name in destination_names):
            abort(400, message="Destinations must be a list of strings.")

        # Convert destination names to lowercase to ensure case-insensitive comparison
        destination_names_lower = [name.lower() for name in destination_names]

        # Query DestinationModel to get the destinations based on the provided names (case-insensitive)
        destinations = DestinationModel.query.filter(
            DestinationModel.name.in_(destination_names_lower)
        ).all()

        # Check if all requested destinations exist in the database (case-insensitive comparison)
        found_destination_names = {destination.name.lower() for destination in destinations}
        missing_destinations = set(destination_names_lower) - found_destination_names

        if missing_destinations:
            # If there are any missing destinations, return an error
            missing_destinations_original_case = [
                name for name in destination_names if name.lower() in missing_destinations
            ]
            abort(404, message=f"These destinations were not found: {', '.join(missing_destinations_original_case)}.")

        # Ensure the activity name is unique
        activity_name = activity_data.get("name")
        existing_activity = ActivityModel.query.filter_by(name=activity_name).first()
        if existing_activity:
            abort(400, message=f"An activity with the name '{activity_name}' already exists.")

        # Create the new activity with the provided data
        activity = ActivityModel(
            name=activity_data["name"],
            description=activity_data.get("description"),
            duration=activity_data["duration"],
            max_participants=activity_data["max_participants"],
            destinations=destination_names,  # Store the original names of destinations as strings
            creator_id=current_user.id
        )

        # Add the activity to the database and commit the transaction
        db.session.add(activity)
        db.session.commit()

        # Return the created activity
        return activity  # Marshmallow will serialize it using the ActivitySchema
