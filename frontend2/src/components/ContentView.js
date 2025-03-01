import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const ContentView = () => {
    const [contentItems, setContentItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const [touchStart, setTouchStart] = useState(null);
    const [scrolling, setScrolling] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const cardRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
  
    useEffect(() => {
        const fetchContent = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/content');
            if (response.data.status === 'success') {
              const activeContent = response.data.data.filter(item => item && !item.isCommented);
              setContentItems(activeContent);
              setLoading(false);
            }
          } catch (err) {
            setError('Failed to fetch content');
            setLoading(false);
          }
        };
    
        // Initial fetch
        fetchContent();
        
        // Set up polling every 5 seconds
        const interval = setInterval(fetchContent, 5000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []); 

    const handleVote = async (contentId, voteType) => {
      try {
        const response = await axios.post(`http://localhost:5000/api/content/${contentId}/vote`, {
          type: voteType
        });
        
        if (response.data.status === 'success') {
          // Update the content items with the new vote count
          setContentItems(prevItems => 
            prevItems.map(item => 
              item.id === contentId ? response.data.data : item
            )
          );
        }
      } catch (err) {
        console.error('Failed to vote:', err);
      }
    };

    const getYouTubeVideoId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    // ... existing handleScroll, handleTouchStart, handleTouchMove functions ...
    const handleScroll = (event) => {
      event.preventDefault();
      if (scrolling) return;
  
      const deltaY = event.deltaY;
      if (deltaY > 0 && currentIndex < contentItems.length - 1) {
        // Scrolling down
        setScrolling(true);
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => setScrolling(false), 300); // Reduced timeout
      } else if (deltaY < 0 && currentIndex > 0) {
        // Scrolling up
        setScrolling(true);
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setScrolling(false), 300); // Reduced timeout
      }
    };
  
    const handleTouchStart = (e) => {
      setTouchStart(e.touches[0].clientY);
    };
  
    const handleTouchMove = (e) => {
      if (!touchStart || scrolling) return;
  
      const touchEnd = e.touches[0].clientY;
      const deltaY = touchStart - touchEnd;
  
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentIndex < contentItems.length - 1) {
          setScrolling(true);
          setCurrentIndex(prev => prev + 1);
          setTimeout(() => setScrolling(false), 300); // Reduced timeout
        } else if (deltaY < 0 && currentIndex > 0) {
          setScrolling(true);
          setCurrentIndex(prev => prev - 1);
          setTimeout(() => setScrolling(false), 300); // Reduced timeout
        }
        setTouchStart(null);
      }
    };

    useEffect(() => {
      const timer = setTimeout(() => setScrolling(false), 1000);
      return () => clearTimeout(timer);
    }, [currentIndex]);

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
  
      const preventScroll = (e) => {
        e.preventDefault();
      };
  
      card.addEventListener('wheel', preventScroll, { passive: false });
      return () => card.removeEventListener('wheel', preventScroll);
    }, []);

    const renderVideoContent = (videoUrl) => {
      const videoId = getYouTubeVideoId(videoUrl);
      
      if (videoId) {
        return (
          <Box 
            sx={{ 
              flex: 1, 
              position: 'relative', 
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              bgcolor: 'black',
              cursor: 'pointer' // Add pointer cursor to indicate clickable
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            onWheel={(e) => {
              e.preventDefault();
              handleScroll(e);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1&playlist=${videoId}&loop=1&enablejsapi=1${isPlaying ? '' : '&pause=1'}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                pointerEvents: 'none',
                objectFit: 'cover'
              }}
            />
          </Box>
        );
      } else {
        return (
          <Box 
            sx={{ 
              flex: 1, 
              position: 'relative',
              bgcolor: 'black',
              cursor: 'pointer' // Add pointer cursor to indicate clickable
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                  setIsPlaying(true);
                } else {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }
            }}
            onWheel={(e) => {
              e.preventDefault();
              handleScroll(e);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              src={videoUrl}
              autoPlay
              muted
              playsInline
              loop
            />
          </Box>
        );
      }
    };

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 56px)">
          <Typography>Loading content...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 56px)">
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    const currentItem = contentItems[currentIndex];

    return (
      <Box
        ref={containerRef}
        sx={{
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'white' // Changed to white for default background
        }}
        onWheel={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 0
            }}
          >
            {currentItem && (
              <Card
              ref={cardRef}
              sx={{
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 0,
                bgcolor: currentItem.type === 'video' ? '#000' : 'white',
                transition: 'opacity 0.3s ease', // Add smooth transition
                opacity: scrolling ? 0 : 1, // Fade out while scrolling
              }}
              >
                {currentItem.type === 'video' ? (
                  renderVideoContent(currentItem.video_url)
                ) : currentItem.type === 'image' ? (
                  <CardMedia
                    component="img"
                    sx={{
                      flex: 1,
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                    image={currentItem.image_url}
                    alt={currentItem.title}
                  />
                ) : (
                  <CardContent 
                    sx={{ 
                      flex: 1, 
                      overflow: 'auto',
                      bgcolor: 'white',
                      p: 2 
                    }}
                  >
                    <Typography variant="body1">{currentItem.description}</Typography>
                  </CardContent>
                )}
              </Card>
            )}
          </Box>
    
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              zIndex: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <IconButton
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={() => handleVote(currentItem.id, 'upvote')}
              >
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="caption" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {currentItem?.upvotes || 0}
              </Typography>
            </Box>
    
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <IconButton
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={() => handleVote(currentItem.id, 'downvote')}
              >
                <ThumbDownIcon />
              </IconButton>
              <Typography variant="caption" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {currentItem?.downvotes || 0}
              </Typography>
            </Box>
    
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <IconButton
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={() => handleVote(currentItem.id, 'creator_upvote')}
              >
                <PersonIcon />
                <ThumbUpIcon sx={{ fontSize: '0.8em', ml: -0.5 }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {currentItem?.creator_upvotes || 0}
              </Typography>
            </Box>
    
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <IconButton
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={() => handleVote(currentItem.id, 'creator_downvote')}
              >
                <PersonIcon />
                <ThumbDownIcon sx={{ fontSize: '0.8em', ml: -0.5 }} />
              </IconButton>
              <Typography variant="caption" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {currentItem?.creator_downvotes || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
};

export default ContentView;