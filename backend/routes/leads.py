from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Lead

leads = Blueprint('leads', __name__)

@leads.route('/api/leads', methods=['GET'])
@jwt_required()
def get_leads():
    try:
        all_leads = Lead.query.all()
        result = []
        for l in all_leads:
            result.append({
                'id': l.id,
                'name': l.name,
                'email': l.email,
                'phone': l.phone,
                'source': l.source,
                'status': l.status
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@leads.route('/api/leads', methods=['POST'])
@jwt_required()
def add_lead():
    try:
        data = request.get_json(force=True)
        new_lead = Lead(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            source=data.get('source'),
            status=data.get('status', 'new')
        )
        db.session.add(new_lead)
        db.session.commit()
        return jsonify({"message": "Lead added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@leads.route('/api/leads/<int:id>', methods=['PUT'])
@jwt_required()
def update_lead(id):
    try:
        lead = Lead.query.get(id)
        if not lead:
            return jsonify({"error": "Lead not found!"}), 404
        data = request.get_json(force=True)
        lead.name = data.get('name', lead.name)
        lead.email = data.get('email', lead.email)
        lead.phone = data.get('phone', lead.phone)
        lead.source = data.get('source', lead.source)
        lead.status = data.get('status', lead.status)
        db.session.commit()
        return jsonify({"message": "Lead updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@leads.route('/api/leads/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_lead(id):
    try:
        lead = Lead.query.get(id)
        if not lead:
            return jsonify({"error": "Lead not found!"}), 404
        db.session.delete(lead)
        db.session.commit()
        return jsonify({"message": "Lead deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500