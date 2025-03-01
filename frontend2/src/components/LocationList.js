import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function LocationList({ locations, onLocationSelect }) {
  const getIconForCategory = (category) => {
    switch (category.toLowerCase()) {
      case 'restaurants':
        return <RestaurantIcon />;
      case 'coffee':
        return <LocalCafeIcon />;
      case 'cars':
        return <DirectionsCarIcon />;
      case 'groceries':
        return <ShoppingCartIcon />;
      default:
        return <RestaurantIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
        Latest in Dyker Heights
      </Typography>
      <Divider />
      <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
        {locations.map((location, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" button onClick={() => onLocationSelect(location)}>
              <ListItemAvatar>
                <Avatar>
                  {getIconForCategory(location.category)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={location.name}
                secondary={location.address}
              />
            </ListItem>
            {index < locations.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default LocationList;