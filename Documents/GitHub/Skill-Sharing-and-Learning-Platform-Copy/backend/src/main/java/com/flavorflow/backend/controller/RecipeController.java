package com.flavorflow.backend.controller;

import com.flavorflow.backend.model.Recipe;
import com.flavorflow.backend.service.RecipeService;
import com.flavorflow.backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // POST method for adding a recipe along with an image/video
    @PostMapping("/add")
    public ResponseEntity<?> addRecipe(@RequestParam("name") String name,
                                       @RequestParam("ingredients") String ingredients,
                                       @RequestParam("instructions") String instructions,
                                       @RequestParam("file") MultipartFile file) {
        try {
            // Upload file to Cloudinary
            String fileUrl = cloudinaryService.uploadFile(file);

            // Log the file URL to verify it's correct
            System.out.println("Uploaded File URL: " + fileUrl);

            // Create Recipe object and save it to the database
            Recipe recipe = new Recipe(name, ingredients, instructions, fileUrl);
            Recipe savedRecipe = recipeService.saveRecipe(recipe);
            return ResponseEntity.ok(savedRecipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // GET method to retrieve all recipes
    @GetMapping("/all")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        try {
            List<Recipe> recipes = recipeService.getAllRecipes();
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
