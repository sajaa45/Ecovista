from flask import Blueprint, jsonify, request
from models.destination import Destination
from extensions import db

bp = Blueprint('destinations', __name__, url_prefix='/destinations')

@bp.route('/', methods=['GET'])
def get_destinations():
    destinations = Destination.query.all()
    return jsonify([{"id": d.id, "name": d.name, "location": d.location} for d in destinations])

@bp.route('/<int:id>', methods=['GET'])
def get_destination(id):
    destination = Destination.query.get_or_404(id)
    return jsonify({"id": destination.id, "name": destination.name, "description": destination.description, "location": destination.location, "activities": destination.activities, "image_url": destination.image_url})

@bp.route('/', methods=['POST'])
def create_destination():
    data = request.json
    destination = Destination(
        name=data['name'],
        description=data.get('description'),
        location=data.get('location'),
        activities=data.get('activities'),
        image_url=data.get('image_url')
    )
    db.session.add(destination)
    db.session.commit()
    return jsonify({"message": "Destination created", "id": destination.id}), 201

@bp.route('/<int:id>', methods=['DELETE'])
def delete_destination(id):
    destination = Destination.query.get_or_404(id)
    db.session.delete(destination)
    db.session.commit()
    return jsonify({"message": "Destination deleted"})
