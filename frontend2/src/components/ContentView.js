import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, useTheme, useMediaQuery, Tooltip, Button } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const ContentView = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
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
    const [showCaption, setShowCaption] = useState(false);
    
    // New state for vote tracking
    const [userVotes, setUserVotes] = useState({
        // Format: { contentId: { voteType: true/false } }
    });
  
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
      // Check if voting on content (upvote/downvote) or creator (creator_upvote/creator_downvote)
      const isContentVote = voteType === 'upvote' || voteType === 'downvote';
      const isCreatorVote = voteType === 'creator_upvote' || voteType === 'creator_downvote';
      
      // If user already voted this type on this content, treat as "unvote"
      const hasVoted = userVotes[contentId]?.[voteType];
      
      // If user voted the opposite type, we need to "unvote" that first
      let oppositeType = null;
      if (isContentVote) {
        oppositeType = voteType === 'upvote' ? 'downvote' : 'upvote';
      } else if (isCreatorVote) {
        oppositeType = voteType === 'creator_upvote' ? 'creator_downvote' : 'creator_upvote';
      }
      
      const hasOppositeVote = userVotes[contentId]?.[oppositeType];

      try {
        if (hasVoted) {
          // "Unvote" - for tracked client-side votes
          setUserVotes(prev => ({
            ...prev,
            [contentId]: {
              ...prev[contentId],
              [voteType]: false
            }
          }));
          
          // Update local content counts for client-side display
          if (isContentVote) {
            // For content votes, we need to update the API
            await axios.post(`http://localhost:5000/api/content/${contentId}/vote`, {
              type: voteType + '_remove' // This assumes your API handles "upvote_remove" etc.
            });
            
            // Update content items to reflect vote removal
            setContentItems(prevItems => 
              prevItems.map(item => {
                if (item.id === contentId) {
                  // Create a copy of the item to modify
                  const updatedItem = { ...item };
                  // Decrease the vote count
                  if (voteType === 'upvote') {
                    updatedItem.upvotes = Math.max(0, (updatedItem.upvotes || 0) - 1);
                  } else if (voteType === 'downvote') {
                    updatedItem.downvotes = Math.max(0, (updatedItem.downvotes || 0) - 1);
                  }
                  return updatedItem;
                }
                return item;
              })
            );
          } else if (isCreatorVote) {
            // For creator votes, just update the local state since it's not stored in DB
            setContentItems(prevItems => 
              prevItems.map(item => {
                if (item.id === contentId) {
                  // Create a copy of the item to modify
                  const updatedItem = { ...item };
                  // Decrease the vote count
                  if (voteType === 'creator_upvote') {
                    updatedItem.creator_upvotes = Math.max(0, (updatedItem.creator_upvotes || 0) - 1);
                  } else if (voteType === 'creator_downvote') {
                    updatedItem.creator_downvotes = Math.max(0, (updatedItem.creator_downvotes || 0) - 1);
                  }
                  return updatedItem;
                }
                return item;
              })
            );
          }
          
          return;
        }
        
        // Submit the new vote
        if (isContentVote) {
          const response = await axios.post(`http://localhost:5000/api/content/${contentId}/vote`, {
            type: voteType
          });
          
          if (response.data.status === 'success') {
            // Update contentItems with the new vote count from API
            setContentItems(prevItems => 
              prevItems.map(item => 
                item.id === contentId ? response.data.data : item
              )
            );
          }
        } else if (isCreatorVote) {
          // For creator votes, just update the local state since it's not stored in DB
          setContentItems(prevItems => 
            prevItems.map(item => {
              if (item.id === contentId) {
                // Create a copy of the item to modify
                const updatedItem = { ...item };
                
                // Increase the voted type
                if (voteType === 'creator_upvote') {
                  updatedItem.creator_upvotes = (updatedItem.creator_upvotes || 0) + 1;
                } else if (voteType === 'creator_downvote') {
                  updatedItem.creator_downvotes = (updatedItem.creator_downvotes || 0) + 1;
                }
                
                // Decrease the opposite type if it was previously voted
                if (hasOppositeVote) {
                  if (oppositeType === 'creator_upvote') {
                    updatedItem.creator_upvotes = Math.max(0, (updatedItem.creator_upvotes || 0) - 1);
                  } else if (oppositeType === 'creator_downvote') {
                    updatedItem.creator_downvotes = Math.max(0, (updatedItem.creator_downvotes || 0) - 1);
                  }
                }
                
                return updatedItem;
              }
              return item;
            })
          );
        }
        
        // Update user's votes state
        setUserVotes(prev => ({
          ...prev,
          [contentId]: {
            ...prev[contentId],
            [voteType]: true,
            ...(hasOppositeVote && oppositeType ? { [oppositeType]: false } : {})
          }
        }));
      } catch (err) {
        console.error('Failed to vote:', err);
      }
    };

    const getYouTubeVideoId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };
    
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
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              bgcolor: 'black',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
          </Box>
        );
      } else {
        return (
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'black',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography color="white">Loading content...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    const currentItem = contentItems[currentIndex];
    
    // Check if user has voted on current content
    const currentItemVotes = currentItem ? userVotes[currentItem.id] || {} : {};

    return (
      <Box
        ref={containerRef}
        sx={{
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        onWheel={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <Box
          sx={{
            flex: 1,
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
                  width: isMobile ? '100%' : '56.25vh', // 9:16 aspect ratio for vertical video
                  height: '100%',
                  maxHeight: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  bgcolor: currentItem.type === 'video' ? '#000' : 'white',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  opacity: scrolling ? 0 : 1,
                  transform: scrolling ? 'scale(0.98)' : 'scale(1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                }}
                onMouseEnter={() => setShowCaption(true)}
                onMouseLeave={() => setShowCaption(false)}
              >
                {/* Content container with fixed aspect ratio */}
                <Box 
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    flex: 1
                  }}
                >
                  {currentItem.type === 'video' ? (
                    renderVideoContent(currentItem.video_url)
                  ) : currentItem.type === 'image' ? (
                    <CardMedia
                      component="img"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // Make sure image covers entire container
                      }}
                      image={currentItem.image_url}
                      alt={currentItem.title}
                    />
                  ) : (
                    <CardContent 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                        bgcolor: 'white',
                        p: isMobile ? 1.5 : 2
                      }}
                    >
                      <Typography variant="body1">{currentItem.description}</Typography>
                    </CardContent>
                  )}
                  
                  {/* Hover caption for web view */}
                  {!isMobile && showCaption && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        p: 2,
                        transition: 'opacity 0.3s ease',
                        opacity: showCaption ? 1 : 0
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        sx={{ fontSize: '1.1rem', mb: 0.5 }}
                      >
                        {currentItem.title || "Untitled Content"}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ fontSize: '0.875rem', opacity: 0.9 }}
                      >
                        {currentItem.description || "Unknown location"}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ fontSize: '0.875rem', opacity: 0.9 }}
                      >
                        {currentItem.creator || "Anonymous"}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Mobile-only permanent caption */}
                {isMobile && (
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'white',
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'block',
                    zIndex: 10
                  }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{ fontSize: '1rem' }}
                    >
                      {currentItem.title || "Untitled Content"}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {currentItem.place_name || "Unknown location"}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {currentItem.creator || "Anonymous"}
                    </Typography>
                  </Box>
                )}
              </Card>
            )}
          </Box>
          {/* Enhanced voting buttons on the right side */}
          <Box
            sx={{
              position: 'absolute',
              right: isMobile ? 8 : 16,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 1 : 2,
              zIndex: 1
            }}
          >
            {/* Content upvote button */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Tooltip title="Like this content" placement="left" arrow>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: currentItemVotes.upvote ? '#4CAF50' : '#1768ac', // Green when active, blue when inactive
                    color: 'white',
                    '&:hover': { 
                      bgcolor: currentItemVotes.upvote ? '#66BB6A' : '#FFD700', // Lighter green when active, gold when inactive
                      transform: 'scale(1.1)' 
                    },
                    width: isMobile ? 36 : 48,
                    height: isMobile ? 36 : 48,
                    transition: 'all 0.3s ease',
                    transform: currentItemVotes.upvote ? 'scale(1.1)' : 'scale(1)', // Slightly bigger when active
                    animation: currentItemVotes.upvote ? 'pulse 0.5s' : 'none', // Pulse animation when active
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1.1)' }
                    }
                  }}
                  onClick={() => handleVote(currentItem.id, 'upvote')}
                >
                  <FavoriteIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'white', 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontSize: isMobile ? '0.6rem' : '0.75rem'
                }}
              >
                {currentItem?.upvotes || 0}
              </Typography>
            </Box>
    
            {/* Content downvote button */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Tooltip title="Dislike this content" placement="left" arrow>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: currentItemVotes.downvote ? '#ff4757' : '#1768ac', // Red when active, blue when inactive
                    color: 'white',
                    '&:hover': { 
                      bgcolor: currentItemVotes.downvote ? '#ff6b81' : '#FFD700', // Lighter red when active, gold when inactive
                      transform: 'scale(1.1)' 
                    },
                    width: isMobile ? 36 : 48,
                    height: isMobile ? 36 : 48,
                    transition: 'all 0.3s ease',
                    transform: currentItemVotes.downvote ? 'scale(1.1)' : 'scale(1)', // Slightly bigger when active
                    animation: currentItemVotes.downvote ? 'pulse 0.5s' : 'none', // Pulse animation when active
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1.1)' }
                    }
                  }}
                  onClick={() => handleVote(currentItem.id, 'downvote')}
                >
                  <ThumbDownAltIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'white', 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontSize: isMobile ? '0.6rem' : '0.75rem'
                }}
              >
                {currentItem?.downvotes || 0}
              </Typography>
            </Box>

            {/* Creator upvote button */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Tooltip title="Like this creator" placement="left" arrow>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: currentItemVotes.creator_upvote ? '#4CAF50' : '#1768ac', // Green when active, blue when inactive
                    color: 'white',
                    '&:hover': { 
                      bgcolor: currentItemVotes.creator_upvote ? '#66BB6A' : '#FFD700', // Lighter green when active, gold when inactive
                      transform: 'scale(1.1)' 
                    },
                    width: isMobile ? 36 : 48,
                    height: isMobile ? 36 : 48,
                    transition: 'all 0.3s ease',
                    transform: currentItemVotes.creator_upvote ? 'scale(1.1)' : 'scale(1)', // Slightly bigger when active
                    animation: currentItemVotes.creator_upvote ? 'pulse 0.5s' : 'none', // Pulse animation when active
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1.1)' }
                    }
                  }}
                  onClick={() => handleVote(currentItem.id, 'creator_upvote')}
                >
                  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                    <EmojiEmotionsIcon sx={{ 
                      fontSize: isMobile ? '0.7rem' : '0.9rem', 
                      position: 'absolute',
                      bottom: -4,
                      right: -4
                    }} />
                  </Box>
                </IconButton>
              </Tooltip>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'white', 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontSize: isMobile ? '0.6rem' : '0.75rem'
                }}
              >
                {currentItem?.creator_upvotes || 0}
              </Typography>
            </Box>

            {/* Creator downvote button */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Tooltip title="Dislike this creator" placement="left" arrow>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: currentItemVotes.creator_downvote ? '#ff4757' : '#1768ac', // Red when active, blue when inactive
                    color: 'white',
                    '&:hover': { 
                      bgcolor: currentItemVotes.creator_downvote ? '#ff6b81' : '#FFD700', // Lighter red when active, gold when inactive
                      transform: 'scale(1.1)' 
                    },
                    width: isMobile ? 36 : 48,
                    height: isMobile ? 36 : 48,
                    transition: 'all 0.3s ease',
                    transform: currentItemVotes.creator_downvote ? 'scale(1.1)' : 'scale(1)', // Slightly bigger when active
                    animation: currentItemVotes.creator_downvote ? 'pulse 0.5s' : 'none', // Pulse animation when active
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1.1)' }
                    }
                  }}
                  onClick={() => handleVote(currentItem.id, 'creator_downvote')}
                >
                  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                    <SentimentVeryDissatisfiedIcon sx={{ 
                      fontSize: isMobile ? '0.7rem' : '0.9rem', 
                      position: 'absolute',
                      bottom: -4,
                      right: -4
                    }} />
                  </Box>
                </IconButton>
              </Tooltip>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'white', 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontSize: isMobile ? '0.6rem' : '0.75rem'
                }}
              >
                {currentItem?.creator_downvotes || 0}
              </Typography>
            </Box>
          </Box>
          
          {/* Pagination indicator */}
          <Box 
            sx={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
              zIndex: 2
            }}
          >
            {contentItems.map((_, idx) => (
              <Box 
                key={idx}
                sx={{
                  width: isMobile ? 6 : 8,
                  height: isMobile ? 6 : 8,
                  borderRadius: '50%',
                  backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
};

export default ContentView;