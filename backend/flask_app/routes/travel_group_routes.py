from flask.views import MethodView
from flask import request, jsonify
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.travel_group import TravelGroupModel, GroupMemberModel
from marshmallow import ValidationError
from schemas import TravelGroupSchema, GroupMemberSchema  # Import the appropriate schemas for serialization

bp = Blueprint('TravelGroups', 'travelgroups', description="Operations on travel groups")

@bp.route('/travel-group/<int:group_id>')
class TravelGroupItem(MethodView):
    @bp.response(200, TravelGroupSchema)
    def get(self, group_id):
        travel_group = TravelGroupModel.query.get_or_404(group_id)
        return travel_group

    def delete(self, group_id):
        travel_group = TravelGroupModel.query.get_or_404(group_id)
        db.session.delete(travel_group)
        db.session.commit()
        return {"message": "Travel group deleted successfully."}

    @bp.arguments(TravelGroupSchema)
    @bp.response(200, TravelGroupSchema)
    def put(self, travel_group_data, group_id):
        travel_group = TravelGroupModel.query.get(group_id)
        if travel_group:
            travel_group.group_name = travel_group_data["group_name"]
            travel_group.destination = travel_group_data["destination"]
            travel_group.start_date = travel_group_data["start_date"]
            travel_group.end_date = travel_group_data["end_date"]
            travel_group.description = travel_group_data["description"]
            travel_group.contact_info = travel_group_data["contact_info"]
        else:
            travel_group = TravelGroupModel(id=group_id, **travel_group_data)
        db.session.add(travel_group)
        db.session.commit()
        return travel_group


@bp.route('/travel-group')
class TravelGroupList(MethodView):
    @bp.response(200, TravelGroupSchema(many=True))
    def get(self):
        # Extract query parameters
        group_name = request.args.get('group_name')
        destination = request.args.get('destination')
        start_date = request.args.get('start_date')  
        end_date = request.args.get('end_date')      

        # Start building the query
        query = TravelGroupModel.query

        if destination:
            query = query.filter(TravelGroupModel.destination.ilike(f"%{destination}%"))
        if start_date:
            # Validate and use the date string directly for filtering
            query = query.filter(TravelGroupModel.start_date >= start_date)
        if end_date:
            # Validate and use the date string directly for filtering
            query = query.filter(TravelGroupModel.end_date <= end_date)
        if group_name:
            query = query.filter(TravelGroupModel.group_name.ilike(f"%{group_name}%"))

        # Fetch and return results
        groups = query.all()
        return groups


    @bp.arguments(TravelGroupSchema)
    @bp.response(201, TravelGroupSchema)
    def post(self, travel_group_data):
        travel_group = TravelGroupModel(**travel_group_data)
        try:
            db.session.add(travel_group)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while creating the travel group.")
        return travel_group


@bp.route('/travel-group/<int:group_id>/join')
class JoinTravelGroup(MethodView):
    @bp.arguments(GroupMemberSchema)
    def post(self, group_member_data, group_id):
        user_id = group_member_data.get('user_id')
        if not user_id:
            abort(400, message="User  ID is required.")
        
        group_member = GroupMemberModel(group_id=group_id, user_id=user_id)
        try:
            db.session.add(group_member)
            db.session.commit()
            return jsonify({"message": "You have successfully joined the group", "group_member": group_member}), 201
        except SQLAlchemyError as e:
            # Log the error (e) here for debugging
            abort(500, message="An error occurred while trying to join the group.")


@bp.route('/travel-group/<int:group_id>/members')
class TravelGroupMembers(MethodView):
    @bp.response(200, GroupMemberSchema(many=True))
    def get(self, group_id):
        members = GroupMemberModel.query.filter_by(group_id=group_id).all()
        return members


@bp.route('/travel-group/<int:group_id>/leave')
class LeaveTravelGroup(MethodView):
    @bp.arguments(GroupMemberSchema)
    def post(self, group_member_data, group_id):
        group_member = GroupMemberModel.query.filter_by(group_id=group_id, user_id=group_member_data['user_id']).first_or_404()
        db.session.delete(group_member)
        db.session.commit()
        return {"message": "You have successfully left the group."}
