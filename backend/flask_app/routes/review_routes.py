from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from models.review import ReviewModel
from models.destination import DestinationModel  # Assuming you have a DestinationModel
from models.user import UserModel
from extensions import db
from schemas import ReviewSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from routes.user_routes import get_current_user
from flask import request


bp = Blueprint('Reviews', 'reviews', description="Operations on reviews")

@bp.route('/review')
class ReviewList(MethodView, ):
    @bp.response(200, ReviewSchema(many=True))
    def get(self):
        reviews = ReviewModel.query.all()
        return reviews

      # This ensures that the route is protected and requires a valid JWT token
    @bp.arguments(ReviewSchema)
    @bp.response(201, ReviewSchema)
    def post(self, review_data):
        token = request.headers.get('Authorization')
        token = token.split()[1]
        print (token)
        review = ReviewModel(
        destination=review_data['destination'],
        rating=review_data['rating'],
        comment=review_data['comment'],
        username=review_data['username'],
        image_url=review_data['image_url'],
        destination_id=review_data['destination_id']
    )

        try:
            db.session.add(review)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            abort(500, message=f"An error occurred while creating the review: {str(e)}")
        
        return review
