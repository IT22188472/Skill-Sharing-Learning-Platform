package com.flavourflow.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.flavourflow.backend.model.Course;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {

    List<Course> findByStatus(String status);
    
}


