import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/recipes/all")
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <strong>{recipe.name}</strong>: {recipe.ingredients}
            {/* Updated alt attribute for image */}
            {recipe.fileUrl && (
              <img
                src={recipe.fileUrl}
                alt={recipe.name}
                style={{ width: "200px", height: "auto" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
