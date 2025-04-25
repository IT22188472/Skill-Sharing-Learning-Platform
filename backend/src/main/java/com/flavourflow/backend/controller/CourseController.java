package com.flavourflow.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.flavourflow.backend.model.Course;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.CloudinaryService;
import com.flavourflow.backend.service.CourseService;
import com.flavourflow.backend.service.UserService;

import io.jsonwebtoken.lang.Arrays;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Create a new course
    @PostMapping("/add")
    public ResponseEntity<?> createCourse(
            @RequestHeader("Authorization") String jwt,
            @RequestParam("courseCode") String courseCode,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("duration") int duration,
            @RequestParam("level") String level,
            @RequestParam("ageRange") String ageRange,
            @RequestParam("status") String status,
            @RequestParam("skillsImprove") String skillsImproveStr, // comma-separated
            @RequestParam("videos") MultipartFile[] videoFiles,
            @RequestParam("images") MultipartFile[] imageFiles) {

        try {
            // Authenticate user
            User reqUser = userService.findUserByJwt(jwt);
            if (reqUser == null) {
                return new ResponseEntity<>(new ApiResponse("User not found or unauthorized", false),
                        HttpStatus.UNAUTHORIZED);
            }

            // Upload images to Cloudinary
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : imageFiles) {
                String url = cloudinaryService.uploadFile(file);
                imageUrls.add(url);
            }

            // Upload videos
            List<String> videoUrls = new ArrayList<>();
            for (MultipartFile file : videoFiles) {
                String url = cloudinaryService.uploadVideo(file);
                videoUrls.add(url);
            }

            // Convert comma-separated strings into lists
            List<String> skillsImprove = Arrays.asList(skillsImproveStr.split(","));

            // Create course object
            Course course = new Course(courseCode, name, description, duration, level, status,
                    skillsImprove, ageRange, imageUrls, videoUrls);
            course.setUser(reqUser);

            Course createdCourse = courseService.saveCourse(course);
            return ResponseEntity.ok(createdCourse);

        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error creating course: " + e.getMessage(), false),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Retrieve all courses
    @GetMapping("/all")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Course>> getActiveCourses() {
        List<Course> activeCourses = courseService.getCoursesByStatus("active");
        return ResponseEntity.ok(activeCourses);
    }

    @DeleteMapping("/coursesdelete/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable String id) {
        boolean deleted = courseService.deleteCourse(id);
        if (deleted) {
            return ResponseEntity.ok("Course deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found.");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course updatedCourse) {
        return courseService.updateCourse(id, updatedCourse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update status of the course
    @PutMapping("/update/status/{id}")
    public ResponseEntity<Course> updateCourseStatus(@PathVariable String id,
            @RequestBody Map<String, String> statusRequest) {
        Course course = courseService.getCourseById(id).orElse(null);
        if (course != null) {
            course.setStatus(statusRequest.get("status"));
            courseService.saveCourse(course);
            return ResponseEntity.ok(course);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
