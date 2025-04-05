from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token


auth_bp = Blueprint('auth', __name__)

# Dummy login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Simple hardcoded auth
    if username == "admin" and password == "pass123":
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

    return jsonify({"error": "Invalid credentials"}), 401
