from flask import Blueprint, jsonify, request
from models.review import Review
from extensions import db

bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@bp.route('/', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([{"id": r.id, "user_id": r.user_id, "destination_id": r.destination_id, "rating": r.rating, "comment": r.comment} for r in reviews])

@bp.route('/<int:id>', methods=['GET'])
def get_review(id):
    review = Review.query.get_or_404(id)
    return jsonify({"id": review.id, "user_id": review.user_id, "destination_id": review.destination_id, "rating": review.rating, "comment": review.comment, "created_at": review.created_at})

@bp.route('/', methods=['POST'])
def create_review():
    data = request.json
    review = Review(
        user_id=data['user_id'],
        destination_id=data['destination_id'],
        rating=data['rating'],
        comment=data.get('comment')
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({"message": "Review created", "id": review.id}), 201

@bp.route('/<int:id>', methods=['DELETE'])
def delete_review(id):
    review = Review.query.get_or_404(id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted"})
