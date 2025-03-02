from datetime import datetime
from app import db

class Content(db.Model):
    __tablename__ = 'contents'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(10), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    creator = db.Column(db.String(100), nullable=False)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    
    # Mandatory location data for Google Maps visualization
    latitude = db.Column(db.Float, nullable=False)  # Required for map positioning
    longitude = db.Column(db.Float, nullable=False)  # Required for map positioning
    place_name = db.Column(db.String(200), nullable=True)  # Required for marker label/info window
    
    # Optional Google Places specific field
    place_id = db.Column(db.String(100), nullable=True)  # Optional: for Google Places integration
    
    # Media content fields (optional based on type)
    thumbnail = db.Column(db.String(500))  # For video content
    video_url = db.Column(db.String(500))  # For video content
    image_url = db.Column(db.String(500))  # For image content

    def to_dict(self):
        data = {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'creator': self.creator,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            # Location data always included since it's mandatory
            'location': {
                'lat': self.latitude,
                'lng': self.longitude,
                'place_name': self.place_name,
            }
        }
        
        # Add media-specific data if available
        if self.type == 'video':
            data.update({
                'thumbnail': self.thumbnail,
                'video_url': self.video_url
            })
        elif self.type == 'image':
            data.update({
                'image_url': self.image_url
            })
            
        return data