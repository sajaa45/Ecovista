from flask.views import MethodView
from flask_smorest import Blueprint, abort
from extensions import db
from models.booking import BookingModel
from models.destination import DestinationModel  # Import Destination model to query by name
from marshmallow import ValidationError
from schemas import BookingSchema, UserSchema, DestinationSchema

bp = Blueprint('Bookings', 'booking', description="Operations on bookings")

@bp.route('/booking/<string:username>')
class BookingItem(MethodView):
    @bp.response(200, BookingSchema)
    def get(self, username):
        # Fetch the booking by username
        booking = BookingModel.query.filter_by(username=username).first_or_404()
        return booking

    def delete(self, username):
        # Fetch the booking by username and delete
        booking = BookingModel.query.filter_by(username=username).first_or_404()
        db.session.delete(booking)
        db.session.commit()
        return {"message": "Booking deleted successfully.", "username": username}

    @bp.arguments(BookingSchema)
    @bp.response(200, BookingSchema)
    def put(self, booking_data, username):
        # Fetch the booking by username
        booking = BookingModel.query.filter_by(username=username).first()

        # Retrieve the destination_id by looking up the destination name
        destination_name = booking_data.get("destination")
        destination = DestinationModel.query.filter_by(name=destination_name).first()
        if not destination:
            abort(404, message="Destination not found.")

        # Update booking if found or create a new one
        if booking:
            booking.destination_id = destination.id
            booking.destination = destination_name
            booking.from_date = booking_data["from_date"]
            booking.to_date = booking_data["to_date"]
            booking.status = booking_data["status"]
        else:
            # If no booking exists, create a new one
            booking = BookingModel(
                username=username,
                destination_id=destination.id,
                destination=booking_data["destination"],
                from_date=booking_data["from_date"],
                to_date=booking_data.get("to_date"),
                status=booking_data["status"]
            )

        db.session.add(booking)
        db.session.commit()
        return booking


@bp.route('/booking')
class BookingList(MethodView):
    @bp.response(200, BookingSchema(many=True))
    def get(self):
        # Get all bookings
        bookings = BookingModel.query.all()
        return bookings

    @bp.arguments(BookingSchema)
    @bp.response(201, BookingSchema)
    def post(self, booking_data):
        # Retrieve the destination_id by looking up the destination name
        destination_name = booking_data.get("destination")
        destination = DestinationModel.query.filter_by(name=destination_name).first()
        if not destination:
            abort(404, message="Destination not found.")

        # Handle new booking post request
        booking = BookingModel(
            username=booking_data["username"],
            destination_id=destination.id,
            destination=destination_name,
            from_date=booking_data["from_date"],
            to_date=booking_data.get("to_date"),
            status=booking_data["status"]
        )

        db.session.add(booking)
        db.session.commit()
        return booking
