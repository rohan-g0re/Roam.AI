from flask import Blueprint, jsonify, request
from app.services.claude_service import get_claude_recommendations

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        input_string = data.get('inputString')
        hours = data.get('hours')
        
        if not input_string or not hours:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters'
            }), 400
            
        response_data = get_claude_recommendations(input_string, hours)
        
        if 'content' in response_data and isinstance(response_data['content'], list):
            recommendations = response_data['content'][0]['text'].strip().split('\n')
            return jsonify({
                'status': 'success',
                'data': recommendations
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Unexpected response format',
                'response': response_data
            }), 500
            
    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500