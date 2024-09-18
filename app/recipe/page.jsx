'use client';
import "../globals.css";
import React, { useState } from "react";
import { useInventoryData } from "../page.js";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Select,
  MenuItem
} from "@mui/material";
import Groq from "groq-sdk"; // Ensure the correct import for Groq SDK
import Markdown from "react-markdown";


const RecipePage = () => {
  const inventory = useInventoryData();
  const [selectedItems, setSelectedItems] = useState([]);
  const [recipeContent, setRecipeContent] = useState("");
  const [cuisine, setCuisine] = useState("Any"); // Default cuisine
  const [dietaryRestriction, setDietaryRestriction] = useState("None"); // Default dietary restriction
  const [numberOfPeople, setNumberOfPeople] = useState("1"); // Default number of people as string
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const getGroqChatCompletion = async () => {
    try {
      const ingredientsList = selectedItems.map(item => `${item.name} (${item.amount || "unknown amount"})`).join(", ");
      return groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Create a creative but edible recipe using ONLY these ingredients: ${ingredientsList}. The recipe should feed ${numberOfPeople} people, the dietary restriction is ${dietaryRestriction}, and the cuisine is ${cuisine}. Do not add extra items except for pantry items (water, spices, etc). Output only the recipe nothing extra, the first line should be the title of the recipe. Bold all the title, ingredients header, and instructions headers. Also, give precise measurements for the recipe and if the ingrediants combo is really weird you can make multiple dishes so it is not too random!`,
          }
        ],
        model: "llama3-8b-8192",
      });
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    }
  };

  const fetchRecipe = async () => {
    if (selectedItems.length === 0) {
      setErrorMessage("Please select at least one ingredient to generate a recipe.");
      return;
    }
    if (!numberOfPeople || isNaN(numberOfPeople) || numberOfPeople <= 0) {
      setErrorMessage("Please specify a valid number of people.");
      return;
    }
    setErrorMessage(""); // Clear any previous error messages
    try {
      const chatCompletion = await getGroqChatCompletion();
      console.log("Chat Completion Response:", chatCompletion); // Log the response for debugging
  
      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
        const messageContent = chatCompletion.choices[0]?.message?.content || "";
        setRecipeContent(messageContent);
      } else {
        console.error("Unexpected response structure:", chatCompletion);
      }
    } catch (error) {
      console.error("Error fetching chat completion:", error);
    }
  };

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
          sx={{ color: "#333131", marginBottom: 4 }}
          width="30%"
          display="flex"
          flexDirection="column"
          padding={6}
          height="100vh"
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
          <TextField
            label="Cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Type in the cuisine"
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />

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
              <MenuItem value="Gluten Free">Gluten Free</MenuItem>
              <MenuItem value="Dairy Free">Dairy Free</MenuItem>
              <MenuItem value="Nut Free">Nut Free</MenuItem>
              <MenuItem value="Low Carb">Low Carb</MenuItem>
              <MenuItem value="Keto">Keto</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Number of People"
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputProps={{ inputProps: { min: 1 } }} // Ensure only positive numbers can be entered
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
          <Typography sx={{ color: "#333131" }} variant="h2">
            Recipe Generator
          </Typography>
          <Button
            variant="text"
            sx={{ color: '#333131', '&:hover': { backgroundColor: '#E6E2DA' }, marginTop: 2 }}
            onClick={fetchRecipe}
          >
            Generate Recipe
          </Button>

          {errorMessage && (
            <Typography sx={{ color: '#8B0000', marginTop: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Box width="80%" display="flex" flexDirection="column" alignItems="right" marginTop={4}>
            <Card sx={{ backgroundColor: '#E6E2DA' }}>
              <CardContent>
                <Typography sx={{ color: "#333131" }}>
                  <Markdown>
                    {recipeContent}
                  </Markdown>
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RecipePage;