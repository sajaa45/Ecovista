from extensions import db
from sqlalchemy.orm.attributes import flag_modified
class TravelGroupModel(db.Model):
    __tablename__ = 'TravelGroups'
    id = db.Column(db.Integer, primary_key=True)  # Fixed primary_key to True
    group_name = db.Column(db.String(255),unique=True, nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text,unique=False, nullable=True)
    contact_info = db.Column(db.String(255),unique=False, nullable=False)
    creator_id = db.Column(db.Integer,unique=False, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    members = db.Column(db.JSON, nullable=False, default=[])

    def add_member(self, member):
        """Add a member to the group."""
        if self.members is None:
            self.members = []  # Ensure members is initialized before appending
        if member not in self.members:  # Prevent duplicates
            self.members.append(member)
            flag_modified(self, "members")
            print(f"Members after addddding: {self.members}")  # Log the members after adding
        else:
            print(f"{member} is already a member.")  # Log if the member is already in the list
        
    def remove_member(self, member):
        """Remove a member from the group."""
        if member in self.members:
            self.members.remove(member)
            flag_modified(self, "members")

