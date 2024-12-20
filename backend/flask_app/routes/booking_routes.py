from flask import Blueprint, jsonify, request
from models.booking import Booking
from extensions import db

bp = Blueprint('booking', __name__, url_prefix='/booking')

# GET: Retrieve all bookings
@bp.route('/', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    return jsonify([{
        "id": b.id,
        "user_id": b.user_id,
        "destination_id": b.destination_id,
        "booking_date": b.booking_date,
        "status": b.status
    } for b in bookings])

# GET: Retrieve a specific booking by ID
@bp.route('/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify({
        "id": booking.id,
        "user_id": booking.user_id,
        "destination_id": booking.destination_id,
        "booking_date": booking.booking_date,
        "status": booking.status
    })

# POST: Create a new booking
@bp.route('/', methods=['POST'])
def create_booking():
    data = request.json
    booking = Booking(
        user_id=data['user_id'],
        destination_id=data['destination_id'],
        booking_date=data['booking_date'],
        status=data.get('status', 'pending')  # Default status is 'pending'
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Booking created", "id": booking.id}), 201

# PUT: Update a specific booking by ID
@bp.route('/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.json
    booking = Booking.query.get_or_404(booking_id)
    booking.user_id = data.get('user_id', booking.user_id)
    booking.destination_id = data.get('destination_id', booking.destination_id)
    booking.booking_date = data.get('booking_date', booking.booking_date)
    booking.status = data.get('status', booking.status)
    db.session.commit()
    return jsonify({"message": "Booking updated", "id": booking.id})

# DELETE: Delete a specific booking by ID
@bp.route('/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking deleted", "id": booking_id})
