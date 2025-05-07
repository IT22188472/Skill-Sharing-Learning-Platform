package com.flavourflow.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;
import com.flavourflow.backend.model.Course;
import java.time.LocalDate;

@Document(collection = "completed_courses")
public class CompletedCourse {

    private String id;  // MongoDB ObjectId is typically stored as String

    private User user;
    private Course course;
    private LocalDate completionDate;

    // Default constructor
    public CompletedCourse() {}

    // Constructor
    public CompletedCourse(User user, Course course, LocalDate completionDate) {
        this.user = user;
        this.course = course;
        this.completionDate = completionDate;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }
}
