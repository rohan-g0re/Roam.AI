from flask import Blueprint, jsonify, request
from app.services.claude_service import get_claude_recommendations
from app.models.content import Content
from math import radians, cos, sin, asin, sqrt

recommendations_bp = Blueprint('recommendations', __name__)

def calculate_distance(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers
    return c * r

@recommendations_bp.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        
        input_string = data.get('inputString')
        hours = data.get('hours')
        user_location = data.get('userLocation')  # Get user location from request
        
        if not input_string or not hours or not user_location:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters'
            }), 400
        
        # Get all places from database
        all_content = Content.query.all()
        
        places = [{
            'name': content.place_name,
            'type': content.type,
            'description': content.description,
            'latitude': content.latitude,
            'longitude': content.longitude
        } for content in all_content]
        
        response_data = get_claude_recommendations(
            input_string, 
            hours, 
            places,
            user_location  # Pass user location to the function
        )
        
        if not response_data or 'content' not in response_data:
            return jsonify({
                'status': 'error',
                'message': 'Invalid response from recommendation service'
            }), 500
            
        recommendations = response_data['content'][0]['text'].split('\n')
        recommendations = [r.strip() for r in recommendations if r.strip()]
        
        return jsonify({
            'status': 'success',
            'data': recommendations,
            'places': places
        })
            
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500