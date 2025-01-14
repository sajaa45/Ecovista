from marshmallow import Schema, fields,post_dump

class DestinationSchema(Schema):
    id = fields.Int(dump_only=True) 
    name = fields.Str(required=True)
    description = fields.Str()
    location = fields.Str(required=True)
    activities = fields.Str()
    image_url = fields.Str()
    creator_id = fields.Int(dump_only=True,load_only=True)
    activities = fields.List(fields.Str(), dump_only=True)
class ActivitySchema(Schema):

    id = fields.Integer(dump_only=True)
    name = fields.Str(required=True)
    description = fields.String()
    duration = fields.Integer(required=True)
    max_participants = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    creator_id = fields.Int(dump_only=True,load_only=True)

    # Define the many-to-many relationship with Destination
    destinations = fields.List(fields.Str(), required=True) 

class ReviewSchema(Schema):
    id = fields.Int(dump_only=True) 
    destination = fields.String(required=True)
    rating = fields.Integer(required=True)
    comment = fields.String(required=False)
    username = fields.String(required=True)
    image_url = fields.String(required=False)
    destination_id = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True) 

class TravelGroupSchema(Schema):
    id = fields.Int(dump_only=True) 
    group_name = fields.Str(required=True)
    destination = fields.Str(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    description = fields.Str()
    contact_info = fields.Str(required=True)
    creator_id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True) 
    members = fields.List(fields.Str(), dump_only=True)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)  
    role = fields.Str(dump_only=True)
    image_url = fields.Str()
    new_password = fields.Str(load_only=True)

