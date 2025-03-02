import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, CircularProgress, TextField, Button, createTheme, ThemeProvider, AppBar, Toolbar, Tab, Tabs, useMediaQuery, Paper, Divider, Chip, Avatar, IconButton, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ExploreIcon from '@mui/icons-material/Explore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import Map from './components/Map';
import axios from 'axios';
import './App.css';
import ContentView from './components/ContentView';
import AboutUs from './components/AboutUs';

// Create the custom theme with the gradient background
const theme = createTheme({
  palette: {
    primary: {
      main: '#1768ac',
    },
    secondary: {
      main: '#06bee1',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #03256c 0%, #2541b2 25%, #1768ac 50%, #06bee1 75%, #ffffff 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          overflow: 'hidden', // Prevent body scrolling
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Ensure button styling works consistently across browsers
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '12px 16px',
        },
        contained: {
          boxShadow: '0 4px 15px rgba(3, 37, 108, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(3, 37, 108, 0.35)',
          },
        },
      },
    },
  },
});

// Social media icon styles
const socialIconStyle = {
  backgroundColor: '#1768ac',
  color: 'black', // Changed from white to black
  margin: '0 8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#FFD700', // Yellow color for hover
    transform: 'translateY(-2px)',
  }
};

function App() {
  // Check if device is mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Existing state
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('restaurants');
  const [navValue, setNavValue] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for itinerary functionality
  const [itineraryText, setItineraryText] = useState('');
  const [hours, setHours] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [itinerarySubmitted, setItinerarySubmitted] = useState(false);
  
  // New state for leaderboard
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const handleLocationUpdate = (location) => {
      console.log("Location update received in App:", location);
      setUserLocation(location);
  };

  // API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Leaderboard dummy data
  const leaderboardData = [
    { id: 1, name: 'Raj Sharma', likes: 1245 },
    { id: 2, name: 'Priya Patel', likes: 987 },
    { id: 3, name: 'Amit Kumar', likes: 842 },
    { id: 4, name: 'Neha Singh', likes: 756 },
    { id: 5, name: 'Vikram Mehta', likes: 689 },
    { id: 6, name: 'Ananya Reddy', likes: 567 },
    { id: 7, name: 'Kiran Joshi', likes: 489 },
    { id: 8, name: 'Rahul Gupta', likes: 412 },
    { id: 9, name: 'Divya Malhotra', likes: 356 },
    { id: 10, name: 'Suresh Kapoor', likes: 298 }
  ];

  // Leaderboard handler functions
  const handleLeaderboardOpen = () => {
    setLeaderboardOpen(true);
  };

  const handleLeaderboardClose = () => {
    setLeaderboardOpen(false);
  };

  // Your existing useEffect for fetching locations
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/places/all`)
      .then(response => {
        if (response.data.status === 'success') {
          const formattedLocations = response.data.data.map(place => ({
            id: place.id,
            name: place.title,
            category: place.location_type || 'all',
            address: place.place_name,
            position: place.position,
            description: place.description,
            media: place.media
          }));
          setLocations(formattedLocations);
        } else {
          setError('Failed to load locations');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
        setLoading(false);
      });
  }, []);

  // Your existing useEffect for category filtering
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations.filter(location => location.category === selectedCategory)
      );
    }
  }, [selectedCategory, locations]);

  const handleMarkerClick = (marker) => {
    console.log('Marker clicked:', marker);
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location);
  };

  // Modified handler for itinerary submission to set itinerarySubmitted state
  const handleItinerarySubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("=== Itinerary Submit Debug ===");
      console.log("User location being sent:", userLocation);
      console.log("Input text:", itineraryText);
      console.log("Hours:", hours);
      console.log("========================");

        // Ensure userLocation exists before sending
        if (!userLocation) {
            console.warn('User location not available');
            // You might want to show a user-friendly message here
        }
        
        const response = await axios.post(`${API_BASE_URL}/api/recommendations`, {
            inputString: itineraryText,
            hours: hours,
            userLocation: userLocation // Send null if location not available
        });

        console.log("=== API Response Debug ===");
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        console.log("========================");

        if (response.data.status === 'success') {
            setRecommendations(response.data.data);
            setItinerarySubmitted(true); // Set this to true when the form is successfully submitted
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    } finally {
        setIsSubmitting(false);
    }
  };

  // Reset itinerary form function
  const resetItineraryForm = () => {
    setItinerarySubmitted(false);
    setItineraryText('');
    setHours('');
    setRecommendations([]);
  };

  const handleTabChange = (event, newValue) => {
    setNavValue(newValue);
  };
  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    switch (navValue) {
      case 0:
        return <ContentView />;
      case 1:
        return <Map markers={filteredLocations} onMarkerClick={handleMarkerClick} onLocationUpdate={handleLocationUpdate} />;
      case 2:
        return (
          <Box 
            sx={{
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modern Itinerary UI */}
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 2 : 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto', // Changed from 'hidden' to 'auto' to enable scrolling for the entire section
              }}
            >
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #03256c 0%, #1768ac 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}
                  >
                    {itinerarySubmitted ? "Your Itinerary has been created" : "Plan Your Perfect Day"}
                  </Typography>
                  {!itinerarySubmitted && (
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                      Tell us what you're looking to do and how much time you have. We'll create a personalized itinerary just for you.
                    </Typography>
                  )}
                </Box>
        
                {!itinerarySubmitted && (
                  <form onSubmit={handleItinerarySubmit} style={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: isMobile ? 2 : 0 // Add some bottom margin for mobile
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
                      <TextField
                        label="What are you looking to do?"
                        placeholder="E.g., I want to explore local cuisine, visit museums, and do some shopping"
                        value={itineraryText}
                        onChange={(e) => setItineraryText(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        sx={{
                          flex: isMobile ? '1' : '3',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: '12px',
                          }
                        }}
                      />
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        flex: isMobile ? '1' : '1',
                      }}>
                        <TextField
                          label="Hours available"
                          type="number"
                          value={hours}
                          onChange={(e) => {
                            // Ensure input is a non-negative number
                            const value = Math.max(0, parseInt(e.target.value) || 0);
                            setHours(value.toString());
                          }}
                          inputProps={{ 
                            min: 0, // Set minimum value to 0
                            step: 1  // Increment by 1
                          }}
                          variant="outlined"
                          InputProps={{
                            startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />,
                          }}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              borderRadius: '12px',
                            }
                          }}
                        />
                        
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting || !itineraryText || !hours}
                          sx={{
                            py: 1.5,
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            backgroundColor: '#2541b2 !important', // Changed to a nicer blue color
                            color: 'white !important', // Ensuring text is white for better contrast
                            boxShadow: '0 4px 15px rgba(3, 37, 108, 0.25)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#1976d2 !important', // Lighter blue on hover
                              boxShadow: '0 6px 20px rgba(3, 37, 108, 0.35)',
                              transform: 'translateY(-2px)'
                            },
                            '&:active': {
                              transform: 'translateY(1px)',
                              boxShadow: '0 2px 10px rgba(3, 37, 108, 0.3)',
                            }
                          }}
                        >
                          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Get Itinerary'}
                        </Button>
                      </Box>
                    </Box>
                  </form>
                )}
          
                {/* Recommendation Results */}
                {recommendations.length > 0 && (
                  <Box sx={{ 
                    flex: '1 1 auto',
                    overflow: 'auto', 
                    mt: itinerarySubmitted ? 0 : 2,
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0,0,0,0.15)',
                      borderRadius: '3px',
                    }
                  }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: isMobile ? 2 : 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '16px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            bgcolor: '#1768ac', 
                            width: 40, 
                            height: 40, 
                            mr: 2,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                          }}>
                            <ExploreIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold">Your Custom Itinerary</Typography>
                        </Box>
                        
                        {itinerarySubmitted && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={resetItineraryForm}
                            sx={{
                              borderRadius: '8px',
                              borderColor: '#1768ac',
                              color: '#1768ac',
                              '&:hover': {
                                borderColor: '#03256c',
                                backgroundColor: 'rgba(3, 37, 108, 0.05)',
                              }
                            }}
                          >
                            Create New
                          </Button>
                        )}
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        <Chip 
                          icon={<AccessTimeIcon />} 
                          label={`${hours} hours`} 
                          sx={{ mr: 1, fontWeight: 'medium' }} 
                        />
                        <Chip 
                          icon={<LocationOnIcon />} 
                          label="Local area" 
                          sx={{ fontWeight: 'medium' }} 
                        />
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        {recommendations.map((rec, index) => (
                          <Box key={index} sx={{ 
                            position: 'relative',
                            mb: 2,
                            pl: 4,
                            pb: index < recommendations.length - 1 ? 2 : 0,
                            '&:before': {
                              content: '""',
                              position: 'absolute',
                              left: '12px',
                              top: '24px',
                              bottom: 0,
                              width: '2px',
                              background: index < recommendations.length - 1 ? 'rgba(3, 37, 108, 0.2)' : 'transparent',
                              zIndex: 1
                            }
                          }}>
                            <Box sx={{ 
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#1768ac',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}>
                              {index + 1}
                            </Box>
                            <Typography variant="body1" sx={{ 
                              background: 'rgba(255, 255, 255, 0.7)',
                              p: 2,
                              borderRadius: '12px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                              border: '1px solid rgba(0, 0, 0, 0.05)'
                            }}>
                              {rec}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                )}
            </Paper>
          </Box>
        );
      case 3:
        return <AboutUs />;
      default:
        return <Map markers={filteredLocations} onMarkerClick={handleMarkerClick} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        flexGrow: 1, 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modern header with logo and navigation */}
        <AppBar 
          position="static" 
          sx={{ 
            background: 'transparent',
            boxShadow: 'none',
            padding: isMobile ? '4px 0' : '8px 0'
          }}
        >
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1 : 0,
              padding: isMobile ? '8px 16px' : undefined
            }}
          >
            {/* Stylish logo with proper spacing */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1  // Adding a gap between logo and text
            }}>
              <img 
                src="/Logo_Roamai.png" 
                alt="ROAM.AI Logo"
                style={{
                  height: isMobile ? '30px' : '40px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #ffffff 10%, #06bee1 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(255,255,255,0.2)',
                  letterSpacing: '0.05em',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica", sans-serif',
                  fontSize: { xs: '1.8rem', sm: '2.5rem' }
                }}
              >
                ROAM.AI
              </Typography>
            </Box>
            
            {/* Desktop Add Post button - only shown when Content tab is active */}
            {!isMobile && navValue === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#ff6b6b',
                  fontWeight: 'bold',
                  color: 'white',
                  borderRadius: '12px',
                  ml: 2,
                  mr: 'auto', // Push it to the left, close to logo
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e07a5f',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  }
                }}
              >
                Add Post
              </Button>
            )}
            
            {/* Tab navigation in header */}
            {isMobile ? (
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'auto',
                  scrollbarWidth: 'none', // Hide scrollbar for Firefox
                  msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
                  '&::-webkit-scrollbar': { 
                    display: 'none' // Hide scrollbar for Chrome/Safari
                  },
                  WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  pb: 1,
                  justifyContent: 'space-between', // Spread navigation and button
                }}
              >
                <Tabs 
                  value={navValue} 
                  onChange={handleTabChange}
                  textColor="inherit"
                  variant="scrollable"
                  scrollButtons={false}
                  sx={{ 
                    '& .MuiTabs-indicator': { 
                      backgroundColor: '#fff',
                      height: 3
                    },
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      minWidth: '50px',
                      padding: '6px 8px',
                      fontSize: '0.75rem',
                      '&.Mui-selected': {
                        color: '#fff',
                        fontWeight: 'bold'
                      }
                    },
                    width: 'auto',
                    flex: 1
                  }}
                >
                  <Tab 
                    icon={<VideoLibraryIcon sx={{ fontSize: '1.2rem' }} />} 
                    label="Content" 
                    sx={{ minWidth: 'auto' }} 
                  />
                  <Tab 
                    icon={<MapIcon sx={{ fontSize: '1.2rem' }} />} 
                    label="Map" 
                    sx={{ minWidth: 'auto' }} 
                  />
                  <Tab 
                    icon={<ExploreIcon sx={{ fontSize: '1.2rem' }} />} 
                    label="Itinerary" 
                    sx={{ minWidth: 'auto' }} 
                  />
                  <Tab 
                    icon={<InfoIcon sx={{ fontSize: '1.2rem' }} />} 
                    label="About" 
                    sx={{ minWidth: 'auto' }} 
                  />
                  <Tab 
                    icon={<LeaderboardIcon sx={{ fontSize: '1.2rem' }} />} 
                    label="Leaders" 
                    sx={{ minWidth: 'auto' }} 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLeaderboardOpen();
                    }}
                  />
                </Tabs>
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    display: navValue === 0 ? 'flex' : 'none', // Only show when Content tab is active
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: 'auto',
                    height: '36px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    borderRadius: '12px',
                    ml: 1,
                    mr: 1, // Reduced margin to position it more to the right
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                      backgroundColor: '#e07a5f',
                    }
                  }}
                >
                  Add Post
                </Button>
              </Box>
            ) : (
              /* Desktop Navigation */
              <Tabs 
                value={navValue} 
                onChange={handleTabChange}
                textColor="inherit"
                variant="standard"
                sx={{ 
                  '& .MuiTabs-indicator': { 
                    backgroundColor: '#fff',
                    height: 3
                  },
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    minWidth: 'auto',
                    '&.Mui-selected': {
                      color: '#fff',
                      fontWeight: 'bold'
                    }
                  }
                }}
              >
                <Tab 
                  icon={<VideoLibraryIcon sx={{ fontSize: '1.5rem' }} />} 
                  label="Content" 
                  sx={{ minWidth: 'auto' }} 
                />
                <Tab 
                  icon={<MapIcon sx={{ fontSize: '1.5rem' }} />} 
                  label="Map" 
                  sx={{ minWidth: 'auto' }} 
                />
                <Tab 
                  icon={<ExploreIcon sx={{ fontSize: '1.5rem' }} />} 
                  label="Itinerary" 
                  sx={{ minWidth: 'auto' }} 
                />
                <Tab 
                  icon={<InfoIcon sx={{ fontSize: '1.5rem' }} />} 
                  label="About" 
                  sx={{ minWidth: 'auto' }} 
                />
                <Tab 
                  icon={<LeaderboardIcon sx={{ fontSize: '1.5rem' }} />} 
                  label="Leaderboard" 
                  sx={{ minWidth: 'auto' }} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLeaderboardOpen();
                  }}
                />
              </Tabs>
            )}
          </Toolbar>
        </AppBar>
        
        {/* Main content container */}
        <Container 
          maxWidth={isMobile ? "sm" : "lg"} 
          sx={{ 
            mt: isMobile ? 1 : 2,
            px: isMobile ? 1 : 2,
            mb: 3, // Add bottom margin to create gap
            flex: 1,
            height: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 160px)', // Adjusted height to account for footer gap
            display: 'flex',
            flexDirection: 'column',
            overflow: isMobile ? 'auto' : 'hidden',  // Allow scrolling only on mobile
            // Custom scrollbar styling for mobile
            ...(isMobile && {
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '3px',
              }
            })
          }}
        >
          {renderContent()}
        </Container>
        
        {/* Footer */}
        <Box
          sx={{
            bgcolor: 'black',
            py: 2,
            px: 3,
            mt: 'auto', // Push to bottom
            color: 'white',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            © 2025 ROAM.AI. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton size="small" sx={socialIconStyle} aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton size="small" sx={socialIconStyle} aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton size="small" sx={socialIconStyle} aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Leaderboard Dialog */}
        <Dialog
          open={leaderboardOpen}
          onClose={handleLeaderboardClose}
          maxWidth="sm"
          fullWidth
          // Prevent closing by clicking outside
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          aria-labelledby="leaderboard-dialog-title"
          PaperProps={{
            sx: {
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              bgcolor: 'white',
            }
          }}
        >
          <DialogTitle 
            id="leaderboard-dialog-title"
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(90deg, #03256c 0%, #1768ac 100%)',
              color: 'white',
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LeaderboardIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">Top Contributors</Typography>
            </Box>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleLeaderboardClose} 
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table sx={{ minWidth: 300 }} aria-label="leaderboard table">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(3, 37, 108, 0.05)' }}>
                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 2, width: '10%' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Contributor</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', py: 2, width: '25%' }}>Likes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboardData.map((user, index) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                        // Highlight top 3
                        ...(index < 3 && {
                          bgcolor: index === 0 
                            ? 'rgba(255, 215, 0, 0.1)' // Gold
                            : index === 1 
                              ? 'rgba(192, 192, 192, 0.1)' // Silver
                              : 'rgba(205, 127, 50, 0.1)', // Bronze
                        })
                      }}
                    >
                      <TableCell 
                        align="center" 
                        sx={{ 
                          fontWeight: index < 3 ? 'bold' : 'regular',
                          color: index === 0 
                            ? '#D4AF37' // Gold
                            : index === 1 
                              ? '#A9A9A9' // Silver
                              : index === 2 
                                ? '#CD7F32' // Bronze
                                : 'inherit'
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: index === 0 
                                ? '#D4AF37' // Gold
                                : index === 1 
                                  ? '#A9A9A9' // Silver
                                  : index === 2 
                                    ? '#CD7F32' // Bronze
                                    : '#1768ac',
                              width: 32,
                              height: 32,
                              mr: 1.5,
                              fontWeight: 'bold',
                              fontSize: '0.875rem'
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: index < 3 ? 'medium' : 'regular' }}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: index < 3 ? 'bold' : 'regular' }}>
                        {user.likes.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;