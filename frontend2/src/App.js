import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, Typography, CircularProgress, TextField, Button } from '@mui/material';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import LocationList from './components/LocationList';
import CategoryTabs from './components/CategoryTabs';
import Navigation from './components/Navigation';
import axios from 'axios';
import './App.css';
import ContentView from './components/ContentView';

function App() {
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

  // Your existing useEffect for fetching locations
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/places/all')
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

  // Your existing handlers
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredLocations(
        selectedCategory === 'all' 
          ? locations 
          : locations.filter(location => location.category === selectedCategory)
      );
      return;
    }

    const filtered = locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredLocations(filtered);
  };

  const handleMarkerClick = (marker) => {
    console.log('Marker clicked:', marker);
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location);
  };

  // New handler for itinerary submission
  const handleItinerarySubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/recommendations', {
        inputString: itineraryText,
        hours: hours
      });
      if (response.data.status === 'success') {
        setRecommendations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
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
        return <Map markers={filteredLocations} onMarkerClick={handleMarkerClick} />;
      case 2:
        return (
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Typography variant="h6" gutterBottom>Plan Your Itinerary</Typography>
            <form onSubmit={handleItinerarySubmit} style={{ width: '100%', maxWidth: 400 }}>
              <TextField
                label="What are you looking to do?"
                value={itineraryText}
                onChange={(e) => setItineraryText(e.target.value)}
                margin="normal"
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Number of hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                margin="normal"
                fullWidth
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Get Recommendations
              </Button>
            </form>
            {recommendations.length > 0 && (
              <Box mt={3} width="100%">
                <Typography variant="h6" gutterBottom>Recommended Itinerary:</Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {recommendations.map((rec, index) => (
                    <Typography component="li" key={index} gutterBottom>
                      {rec}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return <Map markers={filteredLocations} onMarkerClick={handleMarkerClick} />;
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        {navValue !== 2 && <SearchBar onSearch={handleSearch} />}
        {navValue !== 2 && (
          <CategoryTabs 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        )}
        {renderContent()}
      </Container>
      <Navigation value={navValue} onChange={setNavValue} />
    </Box>
  );
}

export default App;