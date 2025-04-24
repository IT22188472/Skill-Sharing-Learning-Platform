package com.flavourflow.backend.controller;

import com.flavourflow.backend.models.Enrollusrs;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.response.ApiResponse;
import com.flavourflow.backend.service.EnrollmentService;
import com.flavourflow.backend.service.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private UserService userService;

    // Create a new course
    @PostMapping("/enroll")
    public ResponseEntity<?> enrollUser(@RequestHeader("Authorization") String jwt,
            @RequestBody Enrollusrs enrollusrs) {
        try {
            // Extract and validate JWT to get user data
            User reqUser = userService.findUserByJwt(jwt);
            if (reqUser == null) {
                return new ResponseEntity<ApiResponse>(new ApiResponse("User not found or unauthorized", false),
                        HttpStatus.UNAUTHORIZED);
            }

            // Associate course with the user (if needed) and save the course
            enrollusrs.setUser(reqUser); // Assuming Course has a User field for owner/creator
            Enrollusrs Enrollusers = enrollmentService.enrollUserInCourse(enrollusrs);

            return ResponseEntity.ok(Enrollusers);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error creating course: " + e.getMessage(), false),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Retrieve all Enrollements
    @GetMapping("/all")
    public List<Enrollusrs> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollusrs> getEnrollmentById(@PathVariable String id) {
        return enrollmentService.getEnrollmentsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Enrollusrs> findByUserId(@PathVariable String userId) {
        return enrollmentService.findByUserId(userId);
    }

    @GetMapping("/{courseId}/{userId}")
    public List<Enrollusrs> findByCourseIdAndUserId(@PathVariable String courseId, @PathVariable String userId) {
        return enrollmentService.findByCourseIdAndUserId(courseId, userId);
    }

}
