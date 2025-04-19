package com.flavourflow.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Comments")
public class Comment {
    
    @Id
    private String id;

    private String content;
    
    private User user;

    private List<User> liked = new ArrayList<>();

    private LocalDateTime createdAt;

    public Comment() {

    }

    public Comment(String id, String content, User user, List<User> liked, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.user = user;
        this.liked = liked;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<User> getLiked() {
        return liked;
    }

    public void setLiked(List<User> liked) {
        this.liked = liked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}

