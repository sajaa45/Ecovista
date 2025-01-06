from flask.views import MethodView
from flask import request
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.destination import DestinationModel
from marshmallow import ValidationError
from schemas import DestinationSchema  # Assuming a schema for the DestinationModel model

bp = Blueprint('Destinations', 'destinations', description="Operations on destinations")

@bp.route('/destinations/<string:name>')
class DestinationItem(MethodView):
    @bp.response(200, DestinationSchema)
    def get(self, name):
        # Fetch the destination by name instead of id
        destination = DestinationModel.query.filter_by(name=name).first_or_404()
        return destination

    def delete(self, name):
        # Fetch the destination by name instead of id
        destination = DestinationModel.query.filter_by(name=name).first_or_404()
        db.session.delete(destination)
        db.session.commit()
        return {"message": "Destination deleted successfully."}

    @bp.arguments(DestinationSchema)
    @bp.response(200, DestinationSchema)
    def put(self, destination_data, name):
        # Fetch the destination by name instead of id
        destination = DestinationModel.query.filter_by(name=name).first()
        
        if destination:
            destination.name = destination_data["name"]
            destination.description = destination_data["description"]
            destination.location = destination_data["location"]
            destination.image_url = destination_data["image_url"]
        else:
            destination = DestinationModel(name=name, **destination_data)
        
        db.session.add(destination)
        db.session.commit()
        return destination


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

        # Serialize destinations with only the fields you want (name, location, image_url)
        result = [{
            'name': destination.name,
            'location': destination.location,
            'image_url': destination.image_url
        } for destination in destinations]

        return result

    @bp.arguments(DestinationSchema)
    @bp.response(201, DestinationSchema)
    def post(self, destination_data):
        destination = DestinationModel(**destination_data)
        try:
            db.session.add(destination)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while creating the destination.")
        return destination
