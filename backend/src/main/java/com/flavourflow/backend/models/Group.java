package com.flavourflow.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Groups")
public class Group {
    
    @Id
    private String id;
    
    private String name;
    private String description;
    private String imageUrl;
    
    private User creator;
    
    private List<User> members = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt = LocalDateTime.now();

    public Group() {
        this.createdAt = LocalDateTime.now();
    }

    public Group(String id, String name, String description, String imageUrl, User creator, List<User> members, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.creator = creator;
        this.members = members;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void initializeCreatedAtIfNull() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
