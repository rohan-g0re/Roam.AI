import requests
import os
from app.models.content import Content
from math import radians, cos, sin, asin, sqrt

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points on Earth using the Haversine formula
    """
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers
    return c * r

def get_claude_recommendations(input_string, hours, nearby_places, user_location):
    try:
        # Build nearby places context with distances
        places_context = "Available places:\n"
        for place in nearby_places:
            # Calculate distance from user
            distance = calculate_distance(
                user_location['lat'], 
                user_location['lng'],
                float(place['latitude']), 
                float(place['longitude'])
            )
            
            places_context += (
                f"- {place['name']}\n"
                f"  Type: {place['type']}\n"
                f"  Description: {place['description']}\n"
                f"  Distance: {distance:.1f} km from your location\n\n"
            )

        # Build the complete prompt with location context
        prompt = f"""User request: {input_string}
Available time: {hours} hours
Your current location coordinates: {user_location['lat']}, {user_location['lng']}

{places_context}

# Please create an itinerary based on these specifications. Consider the following:
# 1. Start from the user's current location (mention the location but not the exact coordinates)
# 2. Suggest places in a logical order based on distance and travel time
# 3. Ensure the total time including travel fits within {hours} hours
# 5. Do not mention anything related to the excluded places"""

        response = requests.post(
            'https://api.anthropic.com/v1/messages',
            headers={
                'x-api-key': os.environ['ANTHROPIC_API_KEY'],
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
            },
            json={
                'model': 'claude-3-5-sonnet-20241022',
                'system': """You are a local tour guide creating itineraries. Your recommendations must:
                    1. Try to suggest places from the provided places list
                    2. If the required place is not in the list, return the most suitable places as requested by the user
                    3. Create a logical sequence of activities starting from user's location
                    4. Consider travel time between locations
                    5. Provide specific time estimates for each location
                    6. Stay within the requested total time
                    7. try to be as specific as possible with the places
                    8. Don't ask any follow up question at the end
                    If no suitable places are available, clearly state that.""",
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': 1000,
            }
        )
        
        # Debug print
        print("Claude API Response:", response.text)
        
        if response.status_code != 200:
            raise Exception(f"Claude API returned status code {response.status_code}: {response.text}")
            
        response_data = response.json()
        if not response_data:
            raise Exception("Empty response from Claude API")
            
        return response_data

    except requests.exceptions.RequestException as e:
        print(f"Request to Claude API failed: {str(e)}")
        raise Exception(f"Failed to connect to Claude API: {str(e)}")
    except Exception as e:
        print(f"Claude API Error: {str(e)}")
        raise Exception(f"Claude API error: {str(e)}")