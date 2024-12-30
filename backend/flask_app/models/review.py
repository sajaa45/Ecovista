from extensions import db

class ReviewModel(db.Model):
    __tablename__ = 'Reviews'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), db.ForeignKey('Users.username'), nullable=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('Destinations.id'), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer,unique=False, nullable=False)
    comment = db.Column(db.Text, unique=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
