from flask.views import MethodView
from flask import request
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.destination import DestinationModel
from models.activity import ActivityModel
from schemas import DestinationSchema 
from routes.user_routes import get_current_user, get_current_user_front
bp = Blueprint('Destinations', 'destinations', description="Operations on destinations")

@bp.route('/destinations/<string:name>')
class DestinationItem(MethodView):
    @bp.response(200, DestinationSchema)
    def get(self, name):
        destination = DestinationModel.query.filter_by(name=name).first_or_404()

        activity_names = []
        for activity in ActivityModel.query.filter(ActivityModel.destinations.ilike(f"%{destination.name}%")).all():
            activity_names.append(activity.name)

        result = {
            'id':destination.id,
            'name': destination.name,
            'location': destination.location,
            'image_url': destination.image_url,
            'activities': activity_names , 
            'creator_id': destination.creator_id,
            'description': destination.description
        }

        return result
    @bp.arguments(DestinationSchema)
    @bp.response(200, DestinationSchema)
    def put(self, updated_data, name):
        destination = DestinationModel.query.filter_by(name=name).first_or_404()

        if updated_data.get('name', destination.name) != destination.name and \
        DestinationModel.query.filter_by(name=updated_data.get('name')).first():
            abort(400, message="Destination with this name already exists.")

        old_name = destination.name

        activities_to_update = ActivityModel.query.filter(ActivityModel.destinations.contains([old_name])).all()

        activity_names = [activity.name for activity in activities_to_update]

        destination.name = updated_data.get('name', destination.name)
        destination.location = updated_data.get('location', destination.location)
        destination.image_url = updated_data.get('image_url', destination.image_url)
        destination.description = updated_data.get('description', destination.description)

        if old_name != destination.name:
            for activity in activities_to_update:
                activity.destinations = [
                    destination.name if dest == old_name else dest for dest in activity.destinations
                ]
                db.session.add(activity)  
        db.session.add(destination)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message=f"An error occurred while updating the destination: {str(e)}")

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
        destination = DestinationModel.query.filter_by(name=name).first_or_404()
        activity_names = []
        for activity in ActivityModel.query.filter(ActivityModel.destinations.ilike(f"%{destination.name}%")).all():
            activity_names.append(activity.name)
        db.session.delete(destination)
        db.session.commit()
        return {"message": "Destination deleted successfully."}



@bp.route('/destinations')
class DestinationList(MethodView):
    @bp.response(200, DestinationSchema(many=True))
    def get(self):
        
        name = request.args.get('name')
        location = request.args.get('location')

        query = DestinationModel.query
        if name:
            query = query.filter(DestinationModel.name.ilike(f"%{name}%"))
        if location:
            query = query.filter(DestinationModel.location.ilike(f"%{location}%"))

        destinations = query.all()

        result = []
        for destination in destinations:
            activity_names = []
            for activity in ActivityModel.query.filter(ActivityModel.destinations.ilike(f"%{destination.name}%")).all():
                activity_names.append(activity.name)
            result.append({
                'name': destination.name,
                'location': destination.location,
                'image_url': destination.image_url,
                'activities': activity_names  
                
            })

        return result


    @bp.arguments(DestinationSchema)
    @bp.response(201, DestinationSchema)
    def post(self, destination_data):
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

        existing_destination = DestinationModel.query.filter_by(name=destination_data['name']).first()
        if existing_destination:
            abort(400, message="A destination with this name already exists.")  
        destination = DestinationModel(**destination_data)
        destination.creator_id = current_user.id  

        try:
            db.session.add(destination)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()  
            print(f"Error: {str(e)}")  
            abort(500, message="An error occurred while creating the destination.")

        return destination  
