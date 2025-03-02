import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import MapIcon from '@mui/icons-material/Map';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

function Navigation({ value, onChange }) {
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden'
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        sx={{
          height: '64px',
          '& .Mui-selected': {
            color: '#03256c',
          },
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
          }
        }}
      >
        <BottomNavigationAction 
          label="Content" 
          icon={<VideoLibraryIcon />} 
          sx={{ 
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }
            }
          }}
        />
        <BottomNavigationAction 
          label="Map" 
          icon={<MapIcon />}
          sx={{ 
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }
            }
          }}
        />
        <BottomNavigationAction 
          label="Itinerary" 
          icon={<ExploreIcon />}
          sx={{ 
            '&.Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }
            }
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default Navigation;