package com.flavourflow.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.flavourflow.backend.models.CompletedCourse;
import java.util.List;

public interface CompletedCourseRepository extends MongoRepository<CompletedCourse, String> {
    List<CompletedCourse> findByUserId(String userId);


}
