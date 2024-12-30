from flask.views import MethodView
from flask import request
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.destination import DestinationModel
from marshmallow import ValidationError
from schemas import DestinationSchema  # Assuming a schema for the DestinationModel model

bp = Blueprint('Destinations', 'destinations', description="Operations on destinations")

@bp.route('/destinations/<int:id>')
class DestinationItem(MethodView):
    @bp.response(200, DestinationSchema)
    def get(self, id):
        destination = DestinationModel.query.get_or_404(id)
        return destination

    def delete(self, id):
        destination = DestinationModel.query.get_or_404(id)
        db.session.delete(destination)
        db.session.commit()
        return {"message": "DestinationModel deleted successfully."}

    @bp.arguments(DestinationSchema)
    @bp.response(200, DestinationSchema)
    def put(self, destination_data, id):
        destination = DestinationModel.query.get(id)
        if destination:
            destination.name = destination_data["name"]
            destination.description = destination_data["description"]
            destination.location = destination_data["location"]
            destination.activities = destination_data["activities"]
            destination.image_url = destination_data["image_url"]
        else:
            destination = DestinationModel(id=id, **destination_data)
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
        keywords = request.args.get('keywords')

        query = DestinationModel.query
        if name:
            query = query.filter(DestinationModel.name.ilike(f"%{name}%"))
        if location:
            query = query.filter(DestinationModel.location.ilike(f"%{location}%"))
        if keywords:
            query = query.filter(DestinationModel.description.ilike(f"%{keywords}%"))

        destinations = query.all()
        return destinations

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
