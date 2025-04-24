package com.flavourflow.backend.models;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

public class Enrollusrs {
    private String userId;
    private String name;
    private String image;
    private String courseId;
    private LocalDateTime enrollDate;
    private User user;

    // Constructor to initialize enrollment with userId and courseId
    public Enrollusrs(String userId, String name, String image, String courseId) {
        this.userId = userId;
        this.name = name;
        this.image = image;
        this.courseId = courseId;
        this.enrollDate = LocalDateTime.now(ZoneOffset.UTC);
    }

    // Getter and setter methods for userId
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }

    public String getimage() {
        return image;
    }

    public void setimage(String image) {
        this.image = image;
    }

    // Getter and setter methods for courseId
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    // Getter and setter methods for enrollDate
    public LocalDateTime getEnrollDate() {
        return enrollDate;
    }

    public void setEnrollDate(LocalDateTime enrollDate) {
        this.enrollDate = enrollDate;
    }

    @Override
    public String toString() {
        return "Enrollusrs{" +
                "userId='" + userId + '\'' +
                ", courseId='" + courseId + '\'' +
                ", enrollDate=" + enrollDate +
                '}';
    }
}
