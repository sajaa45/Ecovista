from extensions import db

# Association Table for Many-to-Many Relationship
activity_destinations = db.Table(
    'activity_destinations',
    db.Column('activity_id', db.Integer, db.ForeignKey('Activities.id'), primary_key=True),
    db.Column('destination_name', db.String(255), db.ForeignKey('Destinations.name'), primary_key=True)
)

class ActivityModel(db.Model):
    __tablename__ = 'Activities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    duration = db.Column(db.Integer, nullable=False)
    max_participants = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Define the many-to-many relationship with DestinationModel
    destinations = db.relationship(
        'DestinationModel',
        secondary=activity_destinations,
        back_populates='activities'
    )
