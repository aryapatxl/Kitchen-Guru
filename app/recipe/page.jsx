'use client';
import "../globals.css";
import React, { useState } from 'react';
import { useInventoryData } from '/Users/aryapatel/pantry-pal/app/page.js';
import { checkedIcon, icon, TextField, Autocomplete, Box, Typography, Button, Checkbox } from '@mui/material';
import axios from 'axios';

const RecipePage = () => {
  const inventory = useInventoryData();
  const [selectedItems, setSelectedItems] = useState([]);

  // Function to handle item selection
  const handleToggle = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  // Function to make API call
  const fetchRecipe = async () => {
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          ingredients: selectedItems.join(','),
          number: 10,
          apiKey: process.env.NEXT_PUBLIC_API_KEY, // API key as a query parameter
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      marginTop="5%"
    >
      {/* Inventory List on the left side */}
      <Box
        sx={{ color: '#333131' }} 
        width="30%"
        display="flex"
        flexDirection="column"
        padding={6}
        borderRight="1px solid #333131"
      >
        <Typography sx={{color:'#333131'}} variant="h6" marginBottom={"5%"}>Current Inventory</Typography>
        <Autocomplete
          multiple
          id="checkboxes-tags"
          options={inventory}
          disableCloseOnSelect
          getOptionLabel={(item) => item.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps} style={{ color: '#333131' }}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                  sx={{ color: '#333131' }} 
                />
                {option.name} {/* Adjusted from {option.title} to {option.name} */}
              </li>
            );
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Current Inventory" placeholder="Pick your ingredients!" />
          )}
        />
      </Box>

      {/* Recipe Generator on the right side */}
      <Box
        width="70%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={2}
      >
        <Typography sx={{color:'#333131'}} variant="h2">Recipe Generator</Typography>
        <Button
          variant="text"
          sx={{color:'#333131'}}
          onClick={() => fetchRecipe()}
        >
          Generate Recipes
        </Button>
      </Box>

      
    </Box>
  );
};

export default RecipePage;