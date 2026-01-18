from marshmallow import Schema, fields,post_dump


class ReviewSchema(Schema):
    id = fields.Int(dump_only=True) 
    destination = fields.String(required=True)
    rating = fields.Integer(required=True)
    comment = fields.String(required=False)
    username = fields.String(required=True)
    image_url = fields.String(required=False)
    destination_id = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True) 
