from marshmallow import Schema, fields

class DestinationSchema(Schema):
    id = fields.Int(dump_only=True) 
    name = fields.Str(required=True)
    description = fields.Str()
    location = fields.Str(required=True)
    activities = fields.Str()
    image_url = fields.Str()
    activities = fields.List(fields.Pluck('ActivitySchema', 'name'))
class ActivitySchema(Schema):

    id = fields.Integer(dump_only=True)
    name = fields.Str(required=True)
    description = fields.String()
    duration = fields.Integer(required=True)
    max_participants = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    # Define the many-to-many relationship with Destination
    destinations = fields.List(fields.Str(), required=True) 

class ReviewSchema(Schema):
    id = fields.Int(dump_only=True) 
    username = fields.Str(dump_only=True)
    image_url = fields.Str(dump_only=True)
    destination_id = fields.Int(dump_only=True)
    destination= fields.Str(required=True)
    rating = fields.Int(required=True)
    comment = fields.Str()
    created_at = fields.DateTime(dump_only=True) 

class TravelGroupSchema(Schema):
    id = fields.Int(dump_only=True) 
    group_name = fields.Str(required=True)
    destination = fields.Str(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    description = fields.Str()
    contact_info = fields.Str(required=True)
    creator_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True) 
    members = fields.List(fields.Nested('GroupMemberSchema', dump_only=True))


class GroupMemberSchema(Schema):
    id = fields.Int(dump_only=True) 
    group_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    travel_group = fields.Nested('TravelGroupSchema', dump_only=True)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)  
    role = fields.Str(dump_only=True)
    image_url = fields.Str()