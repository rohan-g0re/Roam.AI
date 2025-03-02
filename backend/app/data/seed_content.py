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
        ),

        Content(
        type='video',
        title='Secret Angles of the Eiffel Tower',
        description='Everyone knows the Eiffel Tower, but few know the best spots to view it. In this video, I show you 7 lesser-known vantage points that will give you breathtaking views without the crowds.',
        creator='Paris Uncovered',
        thumbnail='https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
        video_url='https://www.youtube.com/watch?v=RmnRF_lNDbA',
        upvotes=754,
        downvotes=23,
        latitude=48.8584,
        longitude=2.2945,
        place_name='Eiffel Tower',
        place_id='ChIJLU7jZClu5kcR4PcOOO6p3I0'
        ),

        Content(
        type='image',
        title='First Light at the Taj Mahal',
        description='Arrived at 4:30 AM to catch the first light hitting the Taj Mahal. The changing colors as dawn broke created a magical atmosphere that few tourists get to experience.',
        creator='India Heritage Photography',
        image_url='https://images.unsplash.com/photo-1564507592333-c60657eea523',
        upvotes=892,
        downvotes=14,
        latitude=27.1751,
        longitude=78.0421,
        place_name='Taj Mahal',
        place_id='ChIJbf9HxCS1dDkR3M3PwkQLzMc'
        ),
        Content(
            type='blog',
            title='Hidden Ramen Gem in Shinjuku',
            description='''
            Found this incredible ramen shop down a narrow alley in Shinjuku. 
            Their signature tonkotsu ramen has been perfected over 3 generations.
            
            - Best time to visit: Before 11am to avoid long queues
            - Must try: Black garlic tonkotsu with extra chashu
            - Pro tip: Ask for "kaedama" (extra noodles) if you're extra hungry
            
            A true taste of authentic Tokyo ramen culture!
            ''',
            creator='Tokyo Food Hunter',
            upvotes=567,
            downvotes=8,
            latitude=35.6954,
            longitude=139.7005,
            place_name='Fuunji Ramen',
            place_id='ChIJ8bVhx9SMGGARUadC7K7XZQI'
        ),

        Content(
            type='image',
            title='Melbourne\'s Most Instagrammable Cafe',
            description='This hidden cafe in Melbourne\'s laneways serves the most artistic latte art I\'ve ever seen, paired with their famous blue algae smoothie bowl.',
            creator='Coffee Culture',
            image_url='https://images.unsplash.com/photo-1554118811-1e0d58224f24',
            upvotes=432,
            downvotes=21,
            latitude=-37.8136,
            longitude=144.9631,
            place_name='Higher Ground Melbourne',
            place_id='ChIJ2d5S4SBd1moRHHgQ4ZjDzYs'
        ),

        Content(
            type='image',
            title='DUMBO\'s Secret Coffee Lab',
            description='This minimalist coffee shop under the Manhattan Bridge not only serves exceptional pour-overs but also hosts weekly coffee cupping sessions. Their house-roasted Ethiopian beans are a must-try.',
            creator='Coffee Chronicles',
            image_url='https://newyorkspork.com/wp-content/uploads/2024/02/Brooklyn-Edits-1003306.jpg',
            upvotes=334,
            downvotes=9,
            latitude=40.7033,
            longitude=-73.9894,
            place_name='DUMBO Coffee Roasters',
            place_id='ChIJF7yKMlBawokR9EcQeFYz9eM'
        ),

        Content(
            type='video',
            title='Ultimate Guide to Greenpoint Food Market',
            description='Exploring every vendor at this converted warehouse food market. From Polish pierogies to artisanal ice cream, this guide covers the must-try spots and hidden gems.',
            creator='Brooklyn Foodie',
            thumbnail='https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
            video_url='https://www.youtube.com/watch?v=sWCh2lrnIjg',
            upvotes=623,
            downvotes=15,
            latitude=40.7249,
            longitude=-73.9922,
            place_name='Greenpoint Market',
            place_id='ChIJa7ChdUBZwokR8qF7tNxUjfQ'
        ),

        Content(
            type='image',
            title='Red Hook\'s Waterfront Seafood Haven',
            description='This former shipping container turned seafood shack serves the freshest lobster rolls in Brooklyn. Watch the sunset over the Statue of Liberty while enjoying their famous seafood boil.',
            creator='Brooklyn Food Photography',
            image_url='data:image/jpeg;base64,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',
            upvotes=445,
            downvotes=18,
            latitude=40.6744,
            longitude=-74.0113,
            place_name='Red Hook Lobster Pound',
            place_id='ChIJN2S4ELNawokR7_E1YsH_SN4'
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