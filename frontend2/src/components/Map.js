import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Card, CardContent, Typography, Chip, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

function Map({ markers, onMarkerClick, onLocationUpdate }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Responsive container style
    const containerStyle = {
        width: '100%',
        height: '100%', // Make it take full height of parent container
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    };

    // Custom map styles (simplified for brevity)
    const mapStyles = [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
        }
    ];

    const [userLocation, setUserLocation] = useState(null);
    const [contentLocations, setContentLocations] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapConfig, setMapConfig] = useState({
        center: { lat: 40.7580, lng: -73.9855 },  // Default center
        zoom: 12
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    // Get user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    console.log("=== User Location Debug ===");
                    console.log("Browser geolocation:", newLocation);
                    console.log("========================");

                    setUserLocation(newLocation);
                    setMapConfig(prev => ({ ...prev, center: newLocation }));
                    if (onLocationUpdate) {
                        onLocationUpdate(newLocation);
                    }

                    
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    // Fetch content locations
    useEffect(() => {
        const fetchContentLocations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/places/all');
                if (response.data.status === 'success') {
                    setContentLocations(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching content locations:', error);
            }
        };

        fetchContentLocations();
    }, []);

    if (!isLoaded) return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%"
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
        >
            <Typography color="#03256c" fontWeight="medium">Loading map...</Typography>
        </Box>
    );

    // Define marker icons
    const userMarkerIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#03256c', // Dark blue for user location
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
    };

    const contentMarkerIcon = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: '#1768ac', // Blue for content locations
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 2,
        anchor: new window.google.maps.Point(12, 24),
    };

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%', // Full height of parent container
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapConfig.center}
                zoom={mapConfig.zoom}
                onClick={() => setSelectedMarker(null)}
                options={{
                    styles: mapStyles,
                    fullscreenControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    zoomControl: true,
                    gestureHandling: isMobile ? 'cooperative' : 'auto', // Improve mobile map interaction
                    zoomControlOptions: {
                        position: window.google.maps.ControlPosition.RIGHT_CENTER
                    }
                }}
            >
                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={userMarkerIcon}
                        title="Your Location"
                        zIndex={1000}
                    />
                )}

                {/* Content Location Markers */}
                {contentLocations.map((content) => (
                    <Marker
                        key={content.id}
                        position={{
                            lat: content.position.lat,
                            lng: content.position.lng
                        }}
                        icon={contentMarkerIcon}
                        onClick={() => {
                            setSelectedMarker(content);
                            if (onMarkerClick) onMarkerClick(content);
                        }}
                        animation={window.google.maps.Animation.DROP}
                    />
                ))}

                {/* Info Window for selected marker */}
                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.position}
                        onCloseClick={() => setSelectedMarker(null)}
                        options={{
                            pixelOffset: new window.google.maps.Size(0, -40),
                            // Remove maxWidth to allow dynamic sizing
                        }}
                    >
                        <Card sx={{ 
                            boxShadow: 'none',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            // Use max-width instead of fixed width to allow flexibility
                            maxWidth: '350px',
                            width: 'auto',
                        }}>
                            {selectedMarker.media && selectedMarker.media.image_url && (
                                <CardMedia 
                                    component="img" 
                                    image={selectedMarker.media.image_url} 
                                    alt={selectedMarker.title}
                                    sx={{ 
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain' // Changed to 'contain' to maintain aspect ratio
                                    }}
                                />
                            )}
                            <CardContent sx={{ p: isMobile ? 1 : 1.5 }}>
                                <Typography variant="h6" sx={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', mb: 0.5 }}>
                                    {selectedMarker.title}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <LocationOnIcon sx={{ fontSize: isMobile ? 12 : 14, color: '#1768ac', mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontSize: isMobile ? '10px' : '12px', color: 'text.secondary' }}>
                                        {selectedMarker.place_name}
                                    </Typography>
                                </Box>
                                
                                <Typography variant="body2" sx={{ fontSize: isMobile ? '10px' : '12px', mb: 1, color: 'text.secondary' }}>
                                    {selectedMarker.description}
                                </Typography>
                                
                                <Chip 
                                    label="View Details" 
                                    size="small" 
                                    sx={{ 
                                        fontSize: isMobile ? '10px' : '11px', 
                                        height: isMobile ? '20px' : '24px',
                                        backgroundColor: '#1768ac',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#03256c'
                                        }
                                    }} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('View details for:', selectedMarker.id);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </InfoWindow>
                )}
            </GoogleMap>
        </Box>
    );
}

export default React.memo(Map);