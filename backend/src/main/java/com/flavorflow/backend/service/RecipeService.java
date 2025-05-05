package com.flavorflow.backend.service;

import com.flavorflow.backend.model.Recipe;
import com.flavorflow.backend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    // Save recipe to the database
    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    // Retrieve all recipes
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }
}
