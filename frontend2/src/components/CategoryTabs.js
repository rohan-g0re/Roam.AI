import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function CategoryTabs({ selectedCategory, onCategoryChange }) {
  const handleChange = (event, newValue) => {
    onCategoryChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 1 }}>
      <Tabs
        value={selectedCategory}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="category tabs"
        sx={{ '& .MuiTab-root': { minWidth: 'auto' } }}
      >
        <Tab 
          icon={<RestaurantIcon />} 
          label="Restaurants" 
          value="restaurants"
          iconPosition="start"
        />
        <Tab 
          icon={<LocalCafeIcon />} 
          label="Coffee" 
          value="coffee"
          iconPosition="start"
        />
        <Tab 
          icon={<DirectionsCarIcon />} 
          label="Cars" 
          value="cars"
          iconPosition="start"
        />
        <Tab 
          icon={<ShoppingCartIcon />} 
          label="Groceries" 
          value="groceries"
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
}

export default CategoryTabs;