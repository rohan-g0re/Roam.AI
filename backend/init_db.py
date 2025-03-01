from app import app, db
from app.data.seed_content import seed_content

with app.app_context():
    # Create all tables
    db.create_all()
    
    # Seed the database
    seed_content()
    
    print("Database initialized and seeded successfully!")