package com.flavourflow.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.web.multipart.MultipartFile;


import org.springframework.data.annotation.Transient;

@Document(collection = "Posts")
public class Post {
    
    @Id
    private String id;
    
    private String title;
    private String ingredients;
    private String instructions;
    private String imageUrl;
    private String videoUrl; 

    @DBRef(lazy = true)
    //@JsonIgnore
    private User user;

    private List<User> liked = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
   
    @DBRef(lazy = true)
    private List<Comment> comments = new ArrayList<>();

    @Transient
    private MultipartFile imageFile;
    
    @Transient
    private MultipartFile videoFile;

    public Post() {

    }

    public Post(String id, String title, String ingredients, String instructions, String imageUrl, String videoUrl,
            User user, List<User> liked, LocalDateTime createdAt, List<Comment> comments) {
        this.id = id;
        this.title = title;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.user = user;
        this.liked = liked;
        this.createdAt = createdAt;
        this.comments = comments;
    }



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<User> getLiked() {
        return liked;
    }

    public void setLiked(List<User> liked) {
        this.liked = liked;
    }

    public MultipartFile getImageFile() {
        return imageFile;
    }

    public void setImageFile(MultipartFile imageFile) {
        this.imageFile = imageFile;
    }

    public MultipartFile getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(MultipartFile videoFile) {
        this.videoFile = videoFile;
    }
    
    // Initialize createdAt in constructor if it's null
    public void initializeCreatedAtIfNull() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
  

}
