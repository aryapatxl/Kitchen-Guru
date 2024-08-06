'use client';
import "../globals.css";
import React, { useState, useEffect } from 'react';
import { useInventoryData } from '/Users/aryapatel/pantry-pal/app/page.js';
import {
  checkedIcon,
  icon,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
  Checkbox,
  Card,
  CardActions,
  CardContent,
  CardMedia
} from '@mui/material';
import axios from 'axios';

const RecipePage = () => {
  const inventory = useInventoryData();
  const [selectedItems, setSelectedItems] = useState([]);
  const [recipes, setRecipes] = useState([]); // State to hold fetched recipes

  // Handle change event for Autocomplete
  const handleSelectionChange = (event, value) => {
    setSelectedItems(value);
  };

  // Function to make API call
  const fetchRecipe = async () => {
    try {
      const ingredients = selectedItems.map(item => item.name).join(','); // Convert selected items to a comma-separated string
      const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          ingredients: ingredients, // Use the selected ingredients
          ignorePantry: true, // Ignore pantry items
          number: 4,
          apiKey: process.env.NEXT_PUBLIC_API_KEY, // API key as a query parameter
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const extractedRecipes = response.data.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredientCount: recipe.usedIngredientCount,
        missedIngredientCount: recipe.missedIngredientCount,
        likes: recipe.likes,
      }));

      setRecipes(extractedRecipes); // Store fetched recipes in state
      console.log(extractedRecipes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      marginTop="5%"
    >
      <Box display="flex" flexDirection="row" width="100%">
        {/* Inventory List on the left side */}
        <Box
          sx={{ color: '#333131' }} 
          width="30%"
          display="flex"
          flexDirection="column"
          padding={6}
          borderRight="1px solid #333131"
        >
          <Typography sx={{ color: '#333131' }} variant="h6" marginBottom={"5%"}>
            Current Inventory
          </Typography>
          <Autocomplete
            multiple
            id="checkboxes-tags"
            options={inventory}
            disableCloseOnSelect
            getOptionLabel={(item) => item.name}
            onChange={handleSelectionChange} // Capture selection changes
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
                  {option.name}
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
          <Typography sx={{ color: '#333131' }} variant="h2">Recipe Generator</Typography>
          <Button
            variant="text"
            sx={{ color: '#333131' }}
            onClick={fetchRecipe}
          >
            Generate Recipes
          </Button>
        </Box>
      </Box>

      {/* Recipe Cards */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent={'right'}
        marginRight={'10%'}

      >
        {recipes.map((recipe) => (
          <Card key={recipe.id} sx={{maxWidth: 350, margin: 2 }}>
            <CardMedia
              component="img"
              alt={recipe.title}
              height="140"
              image={recipe.image}

            />
            <CardContent>
              <Typography sx={{ color: '#333131' }}gutterBottom variant="h6" component="div">
                {recipe.title}
              </Typography>
              <Typography variant="h7" sx={{ color: '#333131' }}>
                Used Ingredients: {recipe.usedIngredientCount}<br />
                Missed Ingredients: {recipe.missedIngredientCount}<br />
                Likes: {recipe.likes}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default RecipePage;