from flask import Blueprint, jsonify, current_app

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route("/summary", methods=["GET"])
def get_summary():
    mongo = current_app.mongo
    collection = mongo.db.professors

    total = collection.count_documents({})
    avg_hindex = collection.aggregate([
        {"$group": {"_id": None, "avgH": {"$avg": "$h_index"}}}
    ])
    total_citations = collection.aggregate([
        {"$group": {"_id": None, "sumC": {"$sum": "$total_citations"}}}
    ])

    avgH = next(avg_hindex, {"avgH": 0})["avgH"]
    sumC = next(total_citations, {"sumC": 0})["sumC"]

    return jsonify({
        "total_professors": total,
        "average_h_index": round(avgH, 2),
        "total_citations": sumC
    })


@analytics_bp.route("/citations-over-time", methods=["GET"])
def get_citation_trends():
    mongo = current_app.mongo
    collection = mongo.db.professors

    # Filter out documents where citation_trends is missing or not an object
    pipeline = [
        {"$match": {"citation_trends": {"$type": "object"}}},
        {"$group": {
            "_id": None,
            "totals": {
                "$mergeObjects": "$citation_trends"
            }
        }}
    ]

    result = list(collection.aggregate(pipeline))

    if not result:
        return jsonify({})

    trends = result[0]["totals"]
    return jsonify(trends)


@analytics_bp.route("/hindex-distribution", methods=["GET"])
def hindex_distribution():
    mongo = current_app.mongo
    collection = mongo.db.professors

    bins = {
        "0-5": 0,
        "6-10": 0,
        "11-15": 0,
        "16+": 0
    }

    for prof in collection.find({}, {"h_index": 1}):
        h = prof.get("h_index", 0)
        if h <= 5:
            bins["0-5"] += 1
        elif h <= 10:
            bins["6-10"] += 1
        elif h <= 15:
            bins["11-15"] += 1
        else:
            bins["16+"] += 1

    return jsonify(bins)

