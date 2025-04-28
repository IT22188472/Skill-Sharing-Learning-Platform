package com.flavourflow.backend.controller;

import com.flavourflow.backend.request.CompleteCourseRequest;
import com.flavourflow.backend.service.CompletedCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/completedcourses")
public class CompletedCourseController {

    @Autowired
    private CompletedCourseService completedCourseService;

    @PostMapping("/complete")
    public ResponseEntity<String> completeCourse(@RequestBody CompleteCourseRequest request) {
        try {
            // Ensure both userId and courseId are not null
            if (request.getUserId() == null || request.getCourseId() == null) {
                return ResponseEntity.status(400).body("User ID and Course ID must not be null");
            }

            completedCourseService.saveCompletedCourse(request.getUserId(), request.getCourseId());
            return ResponseEntity.ok("Course completed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error completing the course: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCompletedCoursesByUserId(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(completedCourseService.getCompletedCoursesByUserId(userId));
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error fetching completed courses: " + e.getMessage());
        }
    }

}
