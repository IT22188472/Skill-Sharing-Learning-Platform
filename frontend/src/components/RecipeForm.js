import React, { useState } from "react";
import axios from "axios";

const RecipeForm = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Save the selected file (image or video)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("ingredients", recipe.ingredients);
    formData.append("instructions", recipe.instructions);
    formData.append("file", file); 

    try {
      const response = await axios.post("http://localhost:8080/recipes/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Recipe added:", response.data);
      alert("Recipe added successfully!");
      setRecipe({ name: "", ingredients: "", instructions: "" });
      setFile(null); 
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  return (
    <div>
      <h2>Add a Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          placeholder="Recipe Name"
          required
        />
        <input
          type="text"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          placeholder="Ingredients"
          required
        />
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Instructions"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,video/*" 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RecipeForm;
