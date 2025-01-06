from flask.views import MethodView
from flask_smorest import Blueprint, abort
from extensions import db
from models.activity import ActivityModel
from models.destination import DestinationModel  # Import Destination model to query destinations
from marshmallow import ValidationError
from schemas import ActivitySchema, DestinationSchema

bp = Blueprint('Activities', 'activity', description="Operations on activities")

@bp.route('/activity/<string:name>')
class ActivityItem(MethodView):
    @bp.response(200, ActivitySchema)
    def get(self, name):
        # Fetch the activity by ID
        activity = ActivityModel.query.get_or_404(name)
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
        # Fetch the activity by ID
        activity = ActivityModel.query.get_or_404(name)

        # Update activity details
        activity.name = activity_data["name"]
        activity.description = activity_data.get("description")
        activity.duration = activity_data["duration"]
        activity.max_participants = activity_data["max_participants"]

        # Update destinations for the activity
        destination_ids = activity_data.get("destinations", [])
        destinations = DestinationModel.query.filter(DestinationModel.name.in_(destination_ids)).all()

        if not destinations:
            abort(404, message="No destinations found.")

        activity.destinations = destinations

        db.session.commit()
        return activity


@bp.route('/activity')
class ActivityList(MethodView):
    @bp.response(200, ActivitySchema(many=True))
    def get(self):
        # Get all activities
        activities = ActivityModel.query.all()
        return activities

    @bp.arguments(ActivitySchema)
    @bp.response(201, ActivitySchema)
    def post(self, activity_data):
        # Extract the destination names from the request data
        destination_names = activity_data.get("destinations", [])
        
        # Query DestinationModel to get the destinations based on the provided names
        destinations = DestinationModel.query.filter(DestinationModel.name.in_(destination_names)).all()

        # If no destinations are found, return an error
        if not destinations:
            abort(404, message="No destinations found.")

        # Create the new activity with the provided data
        activity = ActivityModel(
            name=activity_data["name"],
            description=activity_data.get("description"),
            duration=activity_data["duration"],
            max_participants=activity_data["max_participants"],
            destinations=destinations  # Assign the found destinations to the activity
        )

        # Add the activity to the database and commit the transaction
        db.session.add(activity)
        db.session.commit()

        # Return the created activity
        return activity
