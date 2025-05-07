package com.flavourflow.backend.service;

import com.flavourflow.backend.models.Enrollusrs;
import com.flavourflow.backend.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    // Method to enroll a user in a course
    public Enrollusrs enrollUserInCourse(Enrollusrs enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    // Method to delete an enrollment by userId and courseId
    public void deleteEnrollmentByUserIdAndCourseId(String userId, String courseId) {
        enrollmentRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    // Retrieve all Enrollments
    public List<Enrollusrs> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Optional<Enrollusrs> getEnrollmentsById(String id) {
        return enrollmentRepository.findById(id);
    }

    public List<Enrollusrs> findByUserId(String userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public List<Enrollusrs> findByCourseIdAndUserId(String courseId, String userId) {
        return enrollmentRepository.findByCourseIdAndUserId(courseId, userId);
    }
}
