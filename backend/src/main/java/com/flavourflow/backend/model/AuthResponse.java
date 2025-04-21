package com.flavourflow.backend.model;

public class AuthResponse {
    private String token;
    private String message;
    private String userId;
    private String firstName;
    private String lastName;
    private String email;

    // Default constructor
    public AuthResponse() {}

    // Basic constructor for simple responses
    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    // Full constructor
    public AuthResponse(String token, String message, String userId, String firstName, String lastName, String email) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
