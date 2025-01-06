from extensions import db

class DestinationModel(db.Model):
    __tablename__ = 'Destinations'

    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    # Define the many-to-many relationship with ActivityModel
    activities = db.relationship(
        'ActivityModel',
        secondary='activity_destinations',  # Must match the association table
        back_populates='destinations'
    )
