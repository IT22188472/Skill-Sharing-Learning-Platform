package com.flavourflow.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flavourflow.backend.model.Course;
import com.flavourflow.backend.models.CompletedCourse;
import com.flavourflow.backend.models.User;
import com.flavourflow.backend.repository.CompletedCourseRepository;
import com.flavourflow.backend.repository.CourseRepository;
import com.flavourflow.backend.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class CompletedCourseService {

    @Autowired
    private CompletedCourseRepository completedCourseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public void saveCompletedCourse(String id, String courseId) {
        // Ensure userId and courseId are Strings (MongoDB ObjectId is a String)

        // Find the user and course using the updated repository methods
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CompletedCourse completedCourse = new CompletedCourse();
        completedCourse.setUser(user);
        completedCourse.setCourse(course);
        completedCourse.setCompletionDate(LocalDate.now());

        completedCourseRepository.save(completedCourse);
    }

    public List<CompletedCourse> getCompletedCoursesByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return completedCourseRepository.findByUser(user);
    }
    
    
}
