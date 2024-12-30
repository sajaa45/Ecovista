from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from models.review import ReviewModel
from extensions import db
from schemas import ReviewSchema  # Assuming you have a ReviewSchema for serialization/deserialization

bp = Blueprint('Reviews', 'reviews', description="Operations on reviews")

@bp.route('/review/<int:id>')
class ReviewItem(MethodView):
    @bp.response(200, ReviewSchema)
    def get(self, id):
        review = ReviewModel.query.get_or_404(id)
        return review

    def delete(self, id):
        review = ReviewModel.query.get_or_404(id)
        db.session.delete(review)
        db.session.commit()
        return {"message": "ReviewModel deleted successfully."}

    @bp.arguments(ReviewSchema)
    @bp.response(200, ReviewSchema)
    def put(self, review_data, id):
        review = ReviewModel.query.get(id)
        if review:
            review.rating = review_data["rating"]
            review.comment = review_data.get("comment", review.comment)
        else:
            review = ReviewModel(id=id, **review_data)
        db.session.add(review)
        db.session.commit()
        return review


@bp.route('/review')
class ReviewList(MethodView):
    @bp.response(200, ReviewSchema(many=True))
    def get(self):
        reviews = ReviewModel.query.all()
        return reviews

    @bp.arguments(ReviewSchema)
    @bp.response(201, ReviewSchema)
    def post(self, review_data):
        review = ReviewModel(**review_data)
        try:
            db.session.add(review)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while creating the review.")
        return review
