// SearchBar.js
import React from 'react';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
import { SearchNormal1 } from 'iconsax-react';

const SearchBar = ({ filterText, setFilterText, handleSearchChange }) => {
  return (
    <FormControl sx={{ width: '100%', ml: { xs: 0, md: 2 } }}>
      <OutlinedInput
        id="header-search"
        value={filterText}
        onChange={handleSearchChange}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: -0.5 }}>
            <SearchNormal1 size={16} />
          </InputAdornment>
        }
        
        aria-describedby="header-search-text"
        inputProps={{
          'aria-label': 'weight'
        }}
        placeholder="Search"
        sx={{ '& .MuiOutlinedInput-input': { p: 1.5 } }}
      />
    </FormControl>
  );
};

export default SearchBar;
