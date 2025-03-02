import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import MyLocationIcon from '@mui/icons-material/MyLocation';

function SearchBar({ onSearch }) {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        width: '100%',
        maxWidth: '600px',
        margin: '16px auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search here"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        variant="outlined"
        sx={{
          backgroundColor: 'white',
          borderRadius: '24px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton edge="start">
                <MyLocationIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <MicIcon />
              </IconButton>
              <IconButton type="submit" edge="end">
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default SearchBar;