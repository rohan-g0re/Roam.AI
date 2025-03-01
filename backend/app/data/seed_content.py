from app import db
from app.models.content import Content

def seed_content():
    """
    Seed the database with content that includes location data for map visualization.
    """
    dummy_content = [
        # 1. Video content - Central Park, New York
        Content(
            type='image',
            title='Hidden Spots in Central Park',
            description='Discover these lesser-known areas of Central Park that most tourists miss!',
            creator='NYC Explorer',
            image_url='https://images.unsplash.com/photo-1534251369789-5067c8b8602a',
            upvotes=342,
            downvotes=15,
            latitude=40.7812,
            longitude=-73.9665,
            place_name='Central Park',
            place_id='ChIJ4zGFAZpYwokRGUGph3Mf37k'
        ),
        
        # 2. Image content - Brooklyn Bridge
        Content(
            type='image',
            title='Sunrise at Brooklyn Bridge',
            description='Captured this amazing sunrise while walking across the Brooklyn Bridge at 5:30 AM.',
            creator='NYC Photographer',
            image_url='https://images.unsplash.com/photo-1496588152823-86ff7695e68f',
            upvotes=521,
            downvotes=8,
            latitude=40.7061,
            longitude=-73.9969,
            place_name='Brooklyn Bridge',
            place_id='ChIJK3vOQyNawokRXEa7UBJ9DGk'
        ),
        
        # 3. Blog content - Times Square
        Content(
            type='blog',
            title='Avoiding Tourist Traps in Times Square',
            description="""
            Times Square is one of NYC's most visited attractions, but it's full of tourist traps.
            Here's my guide to enjoying Times Square like a local:
            
            1. Skip the chain restaurants and try these local spots instead
            2. The best times to visit to avoid crowds
            3. Hidden viewpoints for the best photos
            4. Where locals actually go for entertainment nearby
            
            Follow these tips to save money and have a more authentic experience!
            """,
            creator='NYC Local Guide',
            upvotes=289,
            downvotes=12,
            latitude=40.7580,
            longitude=-73.9855,
            place_name='Times Square',
            place_id='ChIJmQJIxlVYwokRLgeuocVOGVU'
        ),
        
        # 4. Video content - Statue of Liberty
        Content(
            type='image',
            title='Best Views of the Statue of Liberty',
            description='I found the best spots to view and photograph the Statue of Liberty without paying for expensive tours.',
            creator='Budget Travel Guide',
            image_url='https://images.unsplash.com/photo-1605130284535-11dd9eedc58a',
            upvotes=187,
            downvotes=4,
            latitude=40.6892,
            longitude=-74.0445,
            place_name='Statue of Liberty',
            place_id='ChIJPTacEpBQwokRKwIlDXelxkA'
        ),
        
        # 5. Image content - High Line
        Content(
            type='image',
            title='Urban Oasis: The High Line',
            description='The contrast between nature and urban architecture makes the High Line one of NYC\'s most photogenic spots.',
            creator='Urban Landscape Photography',
            image_url='https://img.freepik.com/premium-photo/elevated-oasis-high-line-urban-park-sky-generative-ai_896194-2012.jpg?w=2000',
            upvotes=412,
            downvotes=7,
            latitude=40.7480,
            longitude=-74.0048,
            place_name='The High Line',
            place_id='ChIJ5bQPhMdZwokRkTwKhVxhP1g'
        )
    ]
    
    # Add all content to the database
    for content in dummy_content:
        db.session.add(content)
    
    # Commit the changes
    db.session.commit()
    
    print(f"Added {len(dummy_content)} location-based content items to the database")


    # for content in dummy_content:
    #     db.session.add(content)
    
    # db.session.commit()