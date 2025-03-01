import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';

function Navigation({ value, onChange }) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
      >
        <BottomNavigationAction label="Content" icon={<ListIcon />} />
        <BottomNavigationAction label="Map" icon={<MapIcon />} />
        <BottomNavigationAction label="Itinerary" icon={<ExploreIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default Navigation;