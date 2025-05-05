package com.flavorflow.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "recipes")
@Data
public class Recipe {
    @Id
    private String id;
    private String name;
    private String ingredients;
    private String instructions;
    private String fileUrl;

    // Constructor to include fileUrl
    public Recipe(String name, String ingredients, String instructions, String fileUrl) {
        this.name = name;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.fileUrl = fileUrl;
    }
}
