from extensions import db

class Destination(db.Model):
    __tablename__ = 'Destinations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(255))
    activities = db.Column(db.Text)
    image_url = db.Column(db.String(255))
