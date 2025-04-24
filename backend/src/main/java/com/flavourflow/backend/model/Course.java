package com.flavourflow.backend.model;
import org.springframework.data.mongodb.core.mapping.Document;
import com.flavourflow.backend.models.User;
import org.springframework.data.annotation.Id;
import java.util.List;

@Document
public class Course {

    @Id
    private String courseId;

    private String name;
    private String description;
    private int duration;
    private String level;
    private String ageRange;
    private List<String> video;
    private String status;
    private List<String> skillsImprove;
    private List<String> images;
    private User user;

    public Course() {}

    public Course(String name, String description, int duration, String level, String status,
                  List<String> skillsImprove, String ageRange, List<String> images, List<String> video) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.level = level;
        this.status = status;
        this.skillsImprove = skillsImprove;
        this.ageRange = ageRange;
        this.images = images;
        this.video = video;

    }

    // Getters and setters for all fields
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
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

    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
