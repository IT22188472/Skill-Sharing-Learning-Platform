package com.flavourflow.backend.repository;

import com.flavourflow.backend.models.Enrollusrs;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollusrs, String> {

    List<Enrollusrs> findByUserId(String userId);
    List<Enrollusrs> findByCourseId(String courseId);
    List<Enrollusrs> findByCourseIdAndUserId(String courseId, String userId);

    // Method to delete enrollment by userId and courseId
    void deleteByUserIdAndCourseId(String userId, String courseId);
}
