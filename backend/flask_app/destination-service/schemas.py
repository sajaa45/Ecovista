from marshmallow import Schema, fields,post_dump

class DestinationSchema(Schema):
    id = fields.Int(dump_only=True) 
    name = fields.Str(required=True)
    description = fields.Str()
    location = fields.Str(required=True)
    activities = fields.Str()
    image_url = fields.Str()
    creator_id = fields.Int(dump_only=True)
    activities = fields.List(fields.Str(), dump_only=True)

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
