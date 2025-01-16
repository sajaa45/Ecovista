from flask.views import MethodView
from flask import request
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.destination import DestinationModel
from models.activity import ActivityModel
from marshmallow import ValidationError
from schemas import DestinationSchema  # Assuming a schema for the DestinationModel model
from routes.user_routes import get_current_user, get_current_user_front
bp = Blueprint('Destinations', 'destinations', description="Operations on destinations")

@bp.route('/destinations/<string:name>')
class DestinationItem(MethodView):
    @bp.response(200, DestinationSchema)
    def get(self, name):
        # Fetch the destination by name instead of id
        destination = DestinationModel.query.filter_by(name=name).first_or_404()

        # Get activities linked to this destination
        activity_names = []
        for activity in ActivityModel.query.filter(ActivityModel.destinations.ilike(f"%{destination.name}%")).all():
            activity_names.append(activity.name)

        # Build the response object
        result = {
            'id':destination.id,
            'name': destination.name,
            'location': destination.location,
            'image_url': destination.image_url,
            'activities': activity_names , # Include the list of activities related to the destination
            'creator_id': destination.creator_id,
            'description': destination.description
        }

        return result
    @bp.arguments(DestinationSchema)
    @bp.response(200, DestinationSchema)
    def put(self, updated_data, name):
        # Fetch the existing destination by name
        destination = DestinationModel.query.filter_by(name=name).first_or_404()

        # Check if the updated name already exists
        if updated_data.get('name', destination.name) != destination.name and \
        DestinationModel.query.filter_by(name=updated_data.get('name')).first():
            abort(400, message="Destination with this name already exists.")

        old_name = destination.name

        # Fetch activities referencing the old destination name
        activities_to_update = ActivityModel.query.filter(ActivityModel.destinations.contains([old_name])).all()

        # Collect activity names for response
        activity_names = [activity.name for activity in activities_to_update]

        # Update the destination fields
        destination.name = updated_data.get('name', destination.name)
        destination.location = updated_data.get('location', destination.location)
        destination.image_url = updated_data.get('image_url', destination.image_url)
        destination.description = updated_data.get('description', destination.description)

        # Update activities if the name has changed
        if old_name != destination.name:
            for activity in activities_to_update:
                # Update activity destinations
                activity.destinations = [
                    destination.name if dest == old_name else dest for dest in activity.destinations
                ]
                db.session.add(activity)  # Add updated activity to the session

        # Add the updated destination to the session
        db.session.add(destination)

        try:
            # Commit the transaction
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message=f"An error occurred while updating the destination: {str(e)}")

        # Prepare the result
        result = {
            'name': destination.name,
            'location': destination.location,
            'image_url': destination.image_url,
            'activities': activity_names,
            'creator_id': destination.creator_id,
            'description': destination.description
        }

        return result

        def delete(self, name):
            # Fetch the destination by name instead of id
            destination = DestinationModel.query.filter_by(name=name).first_or_404()

            # Get activities linked to this destination before deleting
            activity_names = []
            for activity in ActivityModel.query.filter(ActivityModel.destinations.ilike(f"%{destination.name}%")).all():
                activity_names.append(activity.name)

            # Delete the destination
            db.session.delete(destination)
            db.session.commit()

            # Return the activities that were linked to this destination
            return {"message": "Destination deleted successfully."}



@bp.route('/destinations')
class DestinationList(MethodView):
    @bp.response(200, DestinationSchema(many=True))
    def get(self):
        
        # Get query parameters
        name = request.args.get('name')
        location = request.args.get('location')

        query = DestinationModel.query
        if name:
            query = query.filter(DestinationModel.name.ilike(f"%{name}%"))
        if location:
            query = query.filter(DestinationModel.location.ilike(f"%{location}%"))

        destinations = query.all()

        # Create the result to store destination data and their related activities
        result = []
        for destination in destinations:
            # Get activities linked to this destination
            activity_names = []
            for activity in ActivityModel.query.filter(ActivityModel.destinations.ilike(f"%{destination.name}%")).all():
                activity_names.append(activity.name)

            # Build the response object with activity names
            result.append({
                'name': destination.name,
                'location': destination.location,
                'image_url': destination.image_url,
                'activities': activity_names  # Include activity names
                
            })

        return result


    @bp.arguments(DestinationSchema)
    @bp.response(201, DestinationSchema)
    def post(self, destination_data):
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

        # Debug print for user info (can be removed later)
        print(f"Current user ID: {current_user.id}")

        # Check for duplicate destination by name
        existing_destination = DestinationModel.query.filter_by(name=destination_data['name']).first()
        if existing_destination:
            abort(400, message="A destination with this name already exists.")  # Return error if duplicate name

        # Create the destination object with provided data
        destination = DestinationModel(**destination_data)
        destination.creator_id = current_user.id  # Assign the creator ID

        try:
            # Commit the new destination to the database
            db.session.add(destination)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback on error
            print(f"Error: {str(e)}")  # Print the exception details for debugging
            abort(500, message="An error occurred while creating the destination.")

        return destination  # Return the created destination
