package com.flavourflow.backend.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String gender;
    private String profileImage;  // Added field to store image URL
    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();
    private List<Post> savedPost = new ArrayList<>();

    public User(){

    }

 
    public User(String id, String firstName, String lastName, String email, String password, String gender,
            List<String> followers, List<String> following) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.followers = followers;
        this.following = following;
    }

    // Getters and setters
    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }



    public List<String> getFollowers() {
        return followers;
    }



    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }



    public List<String> getFollowing() {
        return following;
    }



    public void setFollowing(List<String> following) {
        this.following = following;
    }



    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }



    public List<Post> getSavedPost() {
        return savedPost;
    }



    public void setSavedPost(List<Post> savedPost) {
        this.savedPost = savedPost;
    }

    
}
