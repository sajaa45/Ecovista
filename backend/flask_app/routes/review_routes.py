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

bp = Blueprint('Reviews', 'reviews', description="Operations on reviews")

@bp.route('/review')
class ReviewList(MethodView):
    @bp.response(200, ReviewSchema(many=True))
    def get(self):
        reviews = ReviewModel.query.all()
        return reviews

    @jwt_required()  # This ensures that the route is protected and requires a valid JWT token
    @bp.arguments(ReviewSchema)
    @bp.response(201, ReviewSchema)
    def post(self, review_data):
        # Retrieve the current user's username from the JWT token
        user_id = get_current_user()  # This gets the 'user_id' from the JWT token
        print( f'Logged in as user {user_id}')
        # Fetch the username from the UserModel using the user_id
        user = UserModel.query.get_or_404(user_id)  # Get user by id
        username = user.username  # Assuming 'username' is part of the token payload
        
        # Retrieve the destination_id from the destination model based on the destination name
        destination_name = review_data.get("destination")  # Get the destination name from the review data
        destination = DestinationModel.query.filter_by(name=destination_name).first()

        if not destination:
            abort(404, message="Destination not found.")  # If the destination doesn't exist

        destination_id = destination.id  # Get the destination_id from the destination model

        # Create the review and set the username and destination_id
        review = ReviewModel(
            username=username, 
            image_url=user.image_url,
            destination_id=destination_id, 
            **review_data
        )

        try:
            db.session.add(review)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()  # Rollback in case of error
            abort(500, message=f"An error occurred while creating the review: {str(e)}")
        
        return review
