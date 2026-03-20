from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Customer

customers = Blueprint('customers', __name__)

@customers.route('/api/customers', methods=['GET'])
@jwt_required()
def get_customers():
    try:
        all_customers = Customer.query.all()
        result = []
        for c in all_customers:
            result.append({
                'id': c.id,
                'name': c.name,
                'email': c.email,
                'phone': c.phone,
                'company': c.company,
                'status': c.status
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customers.route('/api/customers', methods=['POST'])
@jwt_required()
def add_customer():
    try:
        data = request.get_json(force=True)
        new_customer = Customer(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            company=data.get('company'),
            status=data.get('status', 'active')
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customers.route('/api/customers/<int:id>', methods=['PUT'])
@jwt_required()
def update_customer(id):
    try:
        customer = Customer.query.get(id)
        if not customer:
            return jsonify({"error": "Customer not found!"}), 404
        data = request.get_json(force=True)
        customer.name = data.get('name', customer.name)
        customer.email = data.get('email', customer.email)
        customer.phone = data.get('phone', customer.phone)
        customer.company = data.get('company', customer.company)
        customer.status = data.get('status', customer.status)
        db.session.commit()
        return jsonify({"message": "Customer updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customers.route('/api/customers/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_customer(id):
    try:
        customer = Customer.query.get(id)
        if not customer:
            return jsonify({"error": "Customer not found!"}), 404
        db.session.delete(customer)
        db.session.commit()
        return jsonify({"message": "Customer deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500