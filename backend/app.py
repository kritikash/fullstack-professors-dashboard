from flask import Flask
from routes.professor_routes import professor_bp
from database.mongo_setup import init_db  # 👈 import this

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/fullstack_dashboard"  # 👈 required

# Setup MongoDB
mongo = init_db(app)
app.mongo = mongo   # 👈 CRITICAL LINE: this fixes everything

# Register routes
app.register_blueprint(professor_bp, url_prefix='/api/professors')

@app.route('/')
def hello():
    return "Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
