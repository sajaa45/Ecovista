from extensions import db

class DestinationModel(db.Model):
    __tablename__ = 'Destinations'
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text,unique=False)
    location = db.Column(db.String(255),unique=False)
    activities = db.Column(db.Text, unique=False)
    image_url = db.Column(db.String(255), unique=False)
