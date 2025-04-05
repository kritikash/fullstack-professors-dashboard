from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId
from flask_jwt_extended import jwt_required


professor_bp = Blueprint('professors', __name__)

@professor_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_professors():
    mongo = current_app.mongo
    data = mongo.db.professors.find()
    output = []

    for prof in data:
        prof["_id"] = str(prof["_id"])
        output.append(prof)

    return jsonify(output)


@professor_bp.route("/", methods=["POST"])
@jwt_required()
def add_professors():
    mongo = current_app.mongo
    data = request.get_json()

    if isinstance(data, list):
        mongo.db.professors.insert_many(data)
    else:
        mongo.db.professors.insert_one(data)

    return jsonify({"message": "Data inserted"}), 201


@professor_bp.route("/one", methods=["POST"])
@jwt_required()
def add_one_professor():
    mongo = current_app.mongo
    data = request.get_json()

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid format. Expected a single JSON object."}), 400

    mongo.db.professors.insert_one(data)
    return jsonify({"message": "One professor inserted"}), 201

@professor_bp.route("/name/<name>", methods=["GET"])
@jwt_required()
def get_professor_by_name(name):
    mongo = current_app.mongo
    prof = mongo.db.professors.find_one({"name": name})

    if not prof:
        return jsonify({"error": "Professor not found"}), 404

    prof["_id"] = str(prof["_id"])
    return jsonify(prof)


@professor_bp.route("/<professor_id>", methods=["PUT"])
@jwt_required()
def update_professor(professor_id):
    mongo = current_app.mongo
    data = request.get_json()

    try:
        result = mongo.db.professors.update_one(
            {"_id": ObjectId(professor_id)},
            {"$set": data}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Professor not found"}), 404

    return jsonify({"message": "Professor updated"})


@professor_bp.route("/<professor_id>", methods=["DELETE"])
@jwt_required()
def delete_professor(professor_id):
    mongo = current_app.mongo

    try:
        result = mongo.db.professors.delete_one({"_id": ObjectId(professor_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "Professor not found"}), 404

    return jsonify({"message": "Professor deleted"})





