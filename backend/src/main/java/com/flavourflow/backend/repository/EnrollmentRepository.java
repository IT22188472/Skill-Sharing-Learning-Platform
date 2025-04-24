package com.flavourflow.backend.repository;
import com.flavourflow.backend.models.Enrollusrs;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollusrs, String> {

    List<Enrollusrs> findByUserId(String userId);
    List<Enrollusrs> findByCourseId(String courseId);
    List<Enrollusrs> findByCourseIdAndUserId(String courseId, String userId);
}

