import requests

def get_claude_recommendations(input_string, hours):
    try:
        response = requests.post(
            'https://api.anthropic.com/v1/messages',
            headers={
                'x-api-key': '',
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
            },
            json={
                'model': 'claude-3-7-sonnet-20250219',
                'messages': [
                    {
                        'role': 'user',
                        'content': f'Provide place recommendations based on the following input: {input_string} for {hours} hours'
                    }
                ],
                'max_tokens': 100,
            }
        )
        
        return response.json()
    except Exception as e:
        raise Exception(f"Claude API error: {str(e)}")