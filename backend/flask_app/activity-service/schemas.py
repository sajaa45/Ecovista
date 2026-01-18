from marshmallow import Schema, fields,post_dump

class ActivitySchema(Schema):

    id = fields.Integer(dump_only=True)
    name = fields.Str(required=True)
    description = fields.String()
    duration = fields.Integer(required=True)
    max_participants = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    creator_id = fields.Int(dump_only=True)

    # Define the many-to-many relationship with Destination
    destinations = fields.List(fields.Str(), required=True) 



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

