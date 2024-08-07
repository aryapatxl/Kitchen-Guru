'use client';
import "../globals.css";
import React, { useState } from "react";
import { useInventoryData } from "/Users/aryapatel/pantry-pal/app/page.js";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";
import Groq from "groq-sdk"; // Ensure the correct import for Groq SDK
import Markdown from "react-markdown";

const RecipePage = () => {
  const inventory = useInventoryData();
  const [selectedItems, setSelectedItems] = useState([]);
  const [recipeContent, setRecipeContent] = useState("");
  const [cuisine, setCuisine] = useState(""); // Default cuisine
  const [dietaryRestriction, setDietaryRestriction] = useState(""); // Default dietary restriction
  const [numberOfPeople, setNumberOfPeople] = useState(); // Default number of people

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const getGroqChatCompletion = async () => {
    try {
      return groq.chat.completions.create({
        messages: [
          {
            role: "user", // Ensure role is set correctly
            content: `Create a creative but edible recipe using ONLY these ingredients: ${selectedItems.map(item => item.name).join(", ")}. The recipe should feed ${numberOfPeople} people, the dietary restriction is ${dietaryRestriction}, and the cuisine is ${cuisine}. Do not add extra items except for pantry items (water, spices, etc). Output only the recipe nothing extra, the first line should be the title of the recipe. Bold all the title, ingredients header, and instructions headers.`,
          }
        ],
        
        model: "llama3-8b-8192",
      });
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    }
  };

  // Function to fetch recipe from GROQ API
  const fetchRecipe = async () => {
    try {
      const chatCompletion = await getGroqChatCompletion();
      console.log("Chat Completion Response:", chatCompletion); // Log the response for debugging
  
      // Ensure chatCompletion and choices array are valid
      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
        const messageContent = chatCompletion.choices[0]?.message?.content || "";
        setRecipeContent(messageContent); // Set the content string directly
      } else {
        console.error("Unexpected response structure:", chatCompletion);
      }
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    }
  };
  // Function to handle item selection
  const handleToggle = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
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
          sx={{ color: "#333131" , marginBottom: 4 }}
          width="30%"
          display="flex"
          flexDirection="column"
          padding={6}
          borderRight="1px solid #333131"
          
        >
          <Autocomplete
            multiple
            id="checkboxes-tags"
            options={inventory}
            disableCloseOnSelect
            getOptionLabel={(item) => item.name}
            value={selectedItems}
            onChange={(event, newValue) => setSelectedItems(newValue)}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps} style={{ color: "#333131" }}>
                  <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selected}
                    sx={{ color: "#333131" }}
                  />
                  {option.name}
                </li>
              );
            }}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Current Inventory"
                placeholder="Pick your ingredients!"
              />
            )}
          />
          <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
            <InputLabel id="demo-simple-select-label">Cuisine</InputLabel>
            <Select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              label="Cuisine"
              
            >
              <MenuItem value="Italian">Italian</MenuItem>
              <MenuItem value="Mexican">Mexican</MenuItem>
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Chinese">Indian</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Dietary Restriction</InputLabel>
            <Select
              value={dietaryRestriction}
              onChange={(e) => setDietaryRestriction(e.target.value)}
              label="Dietary Restriction"
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Vegan">Vegan</MenuItem>
              <MenuItem value="Pescatarian">Pescatarian</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Number of People</InputLabel>
            <Select
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              label="Number of People"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={2}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={6}>6</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Recipe Generator on the right side */}
        <Box
          width="70%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={2}
        >
          <Typography sx={{ color: "#333131" }} variant="h2">
            Recipe Generator
          </Typography>
          <Button
            variant="outlined"
            sx={{ color: "#333131", marginTop: 2 }}
            onClick={fetchRecipe}
          >
            Generate Recipe
          </Button>

          <Box width="90%"display="flex" flexDirection="column" alignItems="right" marginTop={2}>
          <Markdown>{recipeContent}</Markdown> {/* Use recipeContent as string */}
        </Box>
        </Box>
      </Box>

      {/* Recipe Display */}

        
      </Box>

  );
};

export default RecipePage;