from flask import Blueprint, jsonify, request
from app.models.content import Content
from math import radians, cos, sin, asin, sqrt

places_bp = Blueprint('places', __name__)

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371 # Radius of earth in kilometers
    return c * r

@places_bp.route('/api/places/all', methods=['GET'])
def get_all_places():
    """Get all content locations for map visualization"""
    try:
        content_list = Content.query.all()
        
        places = [{
            'id': content.id,
            'position': {
                'lat': content.latitude,
                'lng': content.longitude
            },
            'title': content.title,
            'description': content.description,
            'place_name': content.place_name,
            'content_type': content.type,
            # Include media URLs based on content type
            'media': {
                'thumbnail': content.thumbnail if content.type == 'video' else None,
                'video_url': content.video_url if content.type == 'video' else None,
                'image_url': content.image_url if content.type == 'image' else None
            }
        } for content in content_list]

        return jsonify({
            'status': 'success',
            'data': places
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@places_bp.route('/api/places/nearby', methods=['GET'])
def get_nearby_places():
    """Get content locations near a specific point"""
    try:
        # Get parameters
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', default=5.0, type=float)  # Default 5km radius
        
        if not lat or not lng:
            return jsonify({
                'status': 'error',
                'message': 'Latitude and longitude are required'
            }), 400

        content_list = Content.query.all()
        nearby_places = []

        for content in content_list:
            distance = calculate_distance(lat, lng, content.latitude, content.longitude)
            
            if distance <= radius:
                place = {
                    'id': content.id,
                    'position': {
                        'lat': content.latitude,
                        'lng': content.longitude
                    },
                    'title': content.title,
                    'description': content.description,
                    'place_name': content.place_name,
                    'address': content.address,
                    'location_type': content.location_type,
                    'content_type': content.type,
                    'distance': round(distance, 2),  # Distance in km
                    'media': {
                        'thumbnail': content.thumbnail if content.type == 'video' else None,
                        'video_url': content.video_url if content.type == 'video' else None,
                        'image_url': content.image_url if content.type == 'image' else None
                    }
                }
                nearby_places.append(place)

        # Sort by distance
        nearby_places.sort(key=lambda x: x['distance'])

        return jsonify({
            'status': 'success',
            'data': nearby_places
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@places_bp.route('/api/places/filtered', methods=['GET'])
def get_filtered_places():
    """Get content locations with filtering options"""
    try:
        # Get filter parameters
        content_type = request.args.get('content_type')
        location_type = request.args.get('location_type')
        
        # Start with base query
        query = Content.query
        
        # Apply filters if provided
        if content_type:
            query = query.filter(Content.type == content_type)
        if location_type:
            query = query.filter(Content.location_type == location_type)
            
        content_list = query.all()
        
        places = [{
            'id': content.id,
            'position': {
                'lat': content.latitude,
                'lng': content.longitude
            },
            'title': content.title,
            'description': content.description,
            'place_name': content.place_name,
            'address': content.address,
            'location_type': content.location_type,
            'content_type': content.type,
            'media': {
                'thumbnail': content.thumbnail if content.type == 'video' else None,
                'video_url': content.video_url if content.type == 'video' else None,
                'image_url': content.image_url if content.type == 'image' else None
            }
        } for content in content_list]

        return jsonify({
            'status': 'success',
            'data': places
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500