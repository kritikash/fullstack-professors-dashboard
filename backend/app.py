from flask import Flask
from routes.professor_routes import professor_bp
from database.mongo_setup import init_db 
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_bp
from routes.analytics_routes import analytics_bp


app = Flask(__name__)

# JWT Setup
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # Change this for production
jwt = JWTManager(app)
 

# Setup MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/fullstack_dashboard" 
mongo = init_db(app)
app.mongo = mongo   
# Register routes
app.register_blueprint(professor_bp, url_prefix='/api/professors')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

@app.route('/')
def hello():
    return "Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
