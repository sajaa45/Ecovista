from extensions import db

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

    members = db.relationship('GroupMemberModel', backref='travel_group', lazy=True)

class GroupMemberModel(db.Model):
    __tablename__ = 'GroupMembers'
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('TravelGroups.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=False) 
