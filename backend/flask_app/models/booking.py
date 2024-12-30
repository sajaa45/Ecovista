from extensions import db

class BookingModel(db.Model):
    __tablename__ = 'Bookings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), db.ForeignKey('Users.username'), nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('Destinations.id'), nullable=False)
    destination = db.Column(db.String(255), nullable=False)  # Remove if destination_id is sufficient
    from_date = db.Column(db.Date, nullable=False)
    to_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False)

    