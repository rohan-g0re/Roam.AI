import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 156px)',
    borderRadius: '8px',
    marginBottom: '56px'
};

function Map({ onMarkerClick }) {
    const [userLocation, setUserLocation] = useState(null);
    const [contentLocations, setContentLocations] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapConfig, setMapConfig] = useState({
        center: { lat: 40.7580, lng: -73.9855 },  // Centered on Times Square initially
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
                    setUserLocation(newLocation);
                    setMapConfig(prev => ({ ...prev, center: newLocation }));
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
                    console.log('Fetched locations:', response.data.data);
                    setContentLocations(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching content locations:', error);
            }
        };

        fetchContentLocations();
    }, []);

    if (!isLoaded) return <div>Loading map...</div>;

    // Define marker icons
    const userMarkerIcon = {
        path: 0,  // Circle path
        scale: 8,
        fillColor: '#4285F4',  // Blue for user location
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
    };

    const contentMarkerIcon = {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: '#FF0000',  // Red for content locations
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 2,
      anchor: new window.google.maps.Point(12, 24),
  };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapConfig.center}
            zoom={mapConfig.zoom}
            onClick={() => setSelectedMarker(null)}
        >
            {/* User Location Marker */}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={userMarkerIcon}
                    title="Your Location"
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
                    onClick={() => setSelectedMarker(content)}
                />
            ))}

            {/* Info Window for selected marker */}
            {selectedMarker && (
                <InfoWindow
                    position={selectedMarker.position}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div style={{ maxWidth: '200px' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                            {selectedMarker.title}
                        </h3>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                            {selectedMarker.place_name}
                        </p>
                        {selectedMarker.media.image_url && (
                            <img 
                                src={selectedMarker.media.image_url} 
                                alt={selectedMarker.title}
                                style={{ width: '100%', marginBottom: '5px' }}
                            />
                        )}
                        <p style={{ margin: '0', fontSize: '12px' }}>
                            {selectedMarker.description.length > 100 
                                ? `${selectedMarker.description.substring(0, 100)}...` 
                                : selectedMarker.description}
                        </p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

export default React.memo(Map);