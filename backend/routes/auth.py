from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth = Blueprint('auth', __name__)

@auth.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"error": "No data provided!"}), 400

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "All fields are required!"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists!"}), 400

        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"error": "No data provided!"}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password required!"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password!"}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "Login successful!",
            "token": access_token,
            "user": {"id": user.id, "name": user.name, "email": user.email}
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500