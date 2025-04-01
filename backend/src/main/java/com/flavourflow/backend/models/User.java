package com.flavourflow.backend.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String gender;
    private List<Integer> followers= new ArrayList<>();
    private List<Integer> following= new ArrayList<>();

    public User(){

    }

 

    public User(Integer id, String firstName, String lastName, String email, String password, String gender,
            List<Integer> followers, List<Integer> following) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.followers = followers;
        this.following = following;
    }



    public String getGender() {
        return gender;
    }



    public void setGender(String gender) {
        this.gender = gender;
    }



    public List<Integer> getFollowers() {
        return followers;
    }



    public void setFollowers(List<Integer> followers) {
        this.followers = followers;
    }



    public List<Integer> getFollowing() {
        return following;
    }



    public void setFollowing(List<Integer> following) {
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    
}
