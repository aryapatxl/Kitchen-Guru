'use client'

import React from 'react';
import { useInventoryData } from '/Users/aryapatel/pantry-pal/app/page.js';
import { Box, Modal, Stack, TextField, Typography, Button, ButtonGroup } from "@mui/material";
import axios from 'axios';
// Use current inventory to generate recipes with the Recipe Search API
const RecipePage = () => {
  const inventory = useInventoryData();

// Function to make API calls





const fetchRecipe = async () => {
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients: 'apples,flour,sugar',
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

fetchRecipe();
  // Turn inventory into an array
  const currInventory = inventory.map((item) => item.name).join(", ");
  console.log(currInventory)
  return (
    <div>
      <Box
      width="100vw"
      height="100vh"
      display="flex"
      marginTop={"10%"}
      justifyContent="center"
>
      <Typography variant="h2">Recipe Generator</Typography>
      
      </Box>

    </div>
  );
};

export default RecipePage;