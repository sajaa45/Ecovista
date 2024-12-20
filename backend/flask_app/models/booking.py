from extensions import db

class Booking(db.Model):
    __tablename__ = 'Bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('Destinations.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(50), nullable=False)
