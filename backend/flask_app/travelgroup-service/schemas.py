from marshmallow import Schema, fields,post_dump


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

