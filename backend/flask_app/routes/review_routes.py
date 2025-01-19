from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from models.review import ReviewModel
from extensions import db
from schemas import ReviewSchema


bp = Blueprint('Reviews', 'reviews', description="Operations on reviews")

@bp.route('/review')
class ReviewList(MethodView, ):
    @bp.response(200, ReviewSchema(many=True))
    def get(self):
        reviews = ReviewModel.query.all()
        return reviews

    @bp.arguments(ReviewSchema)
    @bp.response(201, ReviewSchema)
    def post(self, review_data):
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
            db.session.rollback()  
            abort(500, message=f"An error occurred while creating the review: {str(e)}")
        
        return review
@bp.route('/review/<int:review_id>')
class Review(MethodView):
    @bp.response(200, ReviewSchema)
    def delete(self, review_id):
        """Delete a review by ID."""
        review = ReviewModel.query.get(review_id)

        if not review:
            abort(404, message="Review not found")

        
        try:
            db.session.delete(review)
            db.session.commit()
            return {"message": "Review deleted successfully"}
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"An error occurred while deleting the review: {str(e)}")
