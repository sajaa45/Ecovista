from extensions import db
from models.activity import ActivityModel
from models.destination import DestinationModel

# Create test data
activity = ActivityModel(name="Hiking", duration=3, max_participants=10)
destination = DestinationModel(name="Mountain Peak", description="Beautiful mountain")

# Establish the relationship
activity.destinations.append(destination)

# Persist to the database
db.session.add(activity)
db.session.add(destination)
db.session.commit()

# Query and verify
print(activity.destinations)  # Should list the added destination(s)
print(destination.activities)  