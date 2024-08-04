'use client';
import "../globals.css";
import React, { useState } from 'react';
import { useInventoryData } from '/Users/aryapatel/pantry-pal/app/page.js';
import { checkedIcon, icon, TextField, Autocomplete, Box, Typography, Button, List, ListItem, Checkbox } from '@mui/material';
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
      marginTop="10%"
    >
      {/* Inventory List on the left side */}
      <Box
        sx={{ color: '#141204' }} 
        width="30%"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        padding={2}
        borderRight="1px solid #F5F5EC"
      >
        <Typography variant="h6">Current Inventory</Typography>
         <Autocomplete
      multiple
      id="checkboxes-tags"
      options={inventory}
      disableCloseOnSelect
      getOptionLabel={(item) => item.name}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              sx={{ color: '#141204' }} 
            />
            {option.title}
          </li>
        );
      }}
      style={{ width: "100%" }}
      renderInput={(params) => (
        <TextField {...params} label="Checkboxes" placeholder="Favorites" />
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
        <Typography sx={{ color: '#141204' }}  variant="h2">Recipe Generator</Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => fetchRecipe()}
        >
          Generate Recipes
        </Button>
      </Box>
    </Box>
  );
};

export default RecipePage;