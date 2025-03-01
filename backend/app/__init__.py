from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure the app
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///content.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.routes.content import content_bp
    app.register_blueprint(content_bp)

    from .routes.places import places_bp
    app.register_blueprint(places_bp)

    from .routes.recommendations import recommendations_bp
    app.register_blueprint(recommendations_bp)
    
    return app

# Create the app instance
app = create_app()