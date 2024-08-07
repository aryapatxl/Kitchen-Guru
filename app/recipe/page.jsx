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
  Checkbox
} from '@mui/material';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const RecipePage = () => {
  const inventory = useInventoryData();
  const [selectedItems, setSelectedItems] = useState([]);
  const [recipes, setRecipes] = useState([]); // State to hold fetched recipes

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
          ingredients: "grapes, wine, bread, butter",
          number: 3,
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

  // Use useEffect to fetch recipes when the component mounts
  useEffect(() => {
    fetchRecipe();
  }, []);

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
        justifyContent="center"
        marginTop={2}
      >
        {recipes.map((recipe) => (
          <Card key={recipe.id} sx={{ maxWidth: 345, margin: 2 }}>
            <CardMedia
              component="img"
              alt={recipe.title}
              height="140"
              image={recipe.image}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {recipe.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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