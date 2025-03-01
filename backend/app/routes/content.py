from flask import Blueprint, jsonify, request
from sqlalchemy import func
from app import db
from app.models.content import Content
from math import radians, cos, sin, asin, sqrt

content_bp = Blueprint('content', __name__)

# content_bp = Blueprint('content', __name__)

# @content_bp.route('/api/content', methods=['GET'])
# def get_content():
#     try:
#         content_list = Content.query.order_by(Content.created_at.desc()).all()
#         return jsonify({
#             'status': 'success',
#             'data': [content.to_dict() for content in content_list]
#         })
#     except Exception as e:
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500



# <UNNECESSARY LOGIC right now>

# def calculate_distance(lat1, lon1, lat2, lon2):
#     """
#     Calculate the great circle distance between two points 
#     on the earth (specified in decimal degrees)
#     """
#     # Convert decimal degrees to radians
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

#     # Haversine formula
#     dlat = lat2 - lat1
#     dlon = lon2 - lon1
#     a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
#     c = 2 * asin(sqrt(a))
#     r = 6371 # Radius of earth in kilometers
#     return c * r

# @content_bp.route('/api/content', methods=['GET'])
# def get_content():
#     try:
#         # Get query parameters
#         lat = request.args.get('lat', type=float)
#         lng = request.args.get('lng', type=float)
#         radius = request.args.get('radius', type=float)  # radius in kilometers
#         content_type = request.args.get('type')
#         location_type = request.args.get('location_type')
        
#         # Start with base query
#         query = Content.query
        
#         # Apply filters if provided
#         if content_type:
#             query = query.filter(Content.type == content_type)
        
#         if location_type:
#             query = query.filter(Content.location_type == location_type)
        
#         # Get all content
#         content_list = query.order_by(Content.created_at.desc()).all()
        
#         # If location parameters are provided, filter and sort by distance
#         if lat and lng:
#             # Calculate distance for each content and filter by radius if specified
#             content_with_distance = []
#             for content in content_list:
#                 distance = calculate_distance(lat, lng, content.latitude, content.longitude)
#                 if radius is None or distance <= radius:
#                     content_dict = content.to_dict()
#                     content_dict['distance'] = round(distance, 2)  # Add distance to content data
#                     content_with_distance.append(content_dict)
            
#             # Sort by distance
#             content_with_distance.sort(key=lambda x: x['distance'])
            
#             return jsonify({
#                 'status': 'success',
#                 'data': content_with_distance
#             })
#         else:
#             # Return all content without distance calculations
#             return jsonify({
#                 'status': 'success',
#                 'data': [content.to_dict() for content in content_list]
#             })

#     except Exception as e:
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500

# </UNNECESSARY LOGIC right now>



@content_bp.route('/api/content', methods=['GET'])
def get_content():
    try:
        # Add debug print statements
        print("Fetching content from database...")
        
        content_list = Content.query.order_by(Content.id.desc()).all()
        
        # Print the number of items found
        print(f"Found {len(content_list)} items in database")
        
        # Print first item details for verification
        if content_list:
            print("First item details:", content_list[0].to_dict())
        
        return jsonify({
            'status': 'success',
            'data': [content.to_dict() for content in content_list]
        })
    except Exception as e:
        print(f"Error in get_content: {str(e)}")  # Debug print
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# DEBUG -----------------------------
@content_bp.route('/api/debug/content', methods=['GET'])
def debug_content():
    try:
        content_list = Content.query.all()
        return jsonify({
            'status': 'success',
            'count': len(content_list),
            'data': [
                {
                    'id': c.id,
                    'title': c.title,
                    'type': c.type,
                    'place_name': c.place_name,
                    'latitude': c.latitude,
                    'longitude': c.longitude,
                    'description': c.description,

                } for c in content_list
            ]
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
# DEBUG -----------------------------











# @content_bp.route('/api/content/nearby', methods=['GET'])
# def get_nearby_content():
#     try:
#         # Required parameters
#         lat = request.args.get('lat', type=float)
#         lng = request.args.get('lng', type=float)
        
#         if not lat or not lng:
#             return jsonify({
#                 'status': 'error',
#                 'message': 'Latitude and longitude are required'
#             }), 400
        
#         # Optional parameters
#         radius = request.args.get('radius', default=5.0, type=float)  # Default 5km radius
#         limit = request.args.get('limit', default=10, type=int)  # Default 10 results
        
#         # Get all content and calculate distances
#         all_content = Content.query.all()
#         nearby_content = []
        
#         for content in all_content:
#             distance = calculate_distance(lat, lng, content.latitude, content.longitude)
#             if distance <= radius:
#                 content_dict = content.to_dict()
#                 content_dict['distance'] = round(distance, 2)
#                 nearby_content.append(content_dict)
        
#         # Sort by distance and limit results
#         nearby_content.sort(key=lambda x: x['distance'])
#         nearby_content = nearby_content[:limit]
        
#         return jsonify({
#             'status': 'success',
#             'data': nearby_content
#         })
        
#     except Exception as e:
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500

# @content_bp.route('/api/content/<int:content_id>', methods=['GET'])
# def get_single_content(content_id):
#     try:
#         content = Content.query.get_or_404(content_id)
#         return jsonify({
#             'status': 'success',
#             'data': content.to_dict()
#         })
#     except Exception as e:
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500

@content_bp.route('/api/content/<int:content_id>/vote', methods=['POST'])
def vote_content(content_id):
    try:
        vote_type = request.json.get('type')
        content = Content.query.get_or_404(content_id)
        
        if vote_type == 'upvote':
            content.upvotes += 1
        elif vote_type == 'downvote':
            content.downvotes += 1
            
        db.session.commit()
        return jsonify({
            'status': 'success',
            'data': content.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500