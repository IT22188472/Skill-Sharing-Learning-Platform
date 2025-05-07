package com.flavourflow.backend.models;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

public class Enrollusrs {
    private String userId;
    private String name;
    private String image;
    private String courseId;
    private LocalDateTime enrollDate;
    private String description;
    private int duration;
    private String level;
    private String ageRange;
    private List<String> video;
    private String status;
    private List<String> skillsImprove;
    private List<String> images;
    private User user;

    // Constructor to initialize enrollment with userId and courseId
    public Enrollusrs(String userId, String name, String image, String courseId, String description, int duration,
            String level, String ageRange, List<String> video, String status, List<String> skillsImprove,
            List<String> images) {
        this.userId = userId;
        this.name = name;
        this.image = image;
        this.courseId = courseId;
        this.enrollDate = LocalDateTime.now(ZoneOffset.UTC);
        this.description = description;
        this.duration = duration;
        this.level = level;
        this.ageRange = ageRange;
        this.video = video;
        this.status = status;
        this.skillsImprove = skillsImprove;
        this.images = images;
    }

    // Getter and setter methods for userId
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAgeRange() {
        return ageRange;
    }

    public void setAgeRange(String ageRange) {
        this.ageRange = ageRange;
    }

    public List<String> getSkillsImprove() {
        return skillsImprove;
    }

    public void setSkillsImprove(List<String> skillsImprove) {
        this.skillsImprove = skillsImprove;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public List<String> getVideo() {
        return video;
    }

    public void setVideo(List<String> video) {
        this.video = video;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

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