import axios from "axios";

const API_URL = "http://localhost:8080/recipes";

export const addRecipe = async (recipe) => {
  return await axios.post(`${API_URL}/add`, recipe, {
    headers: { "Content-Type": "application/json" },
  });
};

export const getRecipes = async () => {
  return await axios.get(API_URL);
};
