package com.flavourflow.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flavourflow.backend.model.Course;
import com.flavourflow.backend.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Save course to the database
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Retrieve all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // ✅ Retrieve course by ID
    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByStatus(String status) {
        return courseRepository.findByStatus(status);
    }
    
    public Optional<Course> updateCourse(String id, Course updatedCourse) {
        return courseRepository.findById(id).map(existingCourse -> {
            existingCourse.setCourseId(updatedCourse.getCourseId());
            existingCourse.setName(updatedCourse.getName());
            existingCourse.setDescription(updatedCourse.getDescription());
            existingCourse.setDuration(updatedCourse.getDuration());
            existingCourse.setLevel(updatedCourse.getLevel());
            existingCourse.setAgeRange(updatedCourse.getAgeRange());
            existingCourse.setSkillsImprove(updatedCourse.getSkillsImprove());
            existingCourse.setImages(updatedCourse.getImages());
            existingCourse.setStatus(updatedCourse.getStatus());
            return courseRepository.save(existingCourse);
        });
    }

    public boolean deleteCourse(String id) {
        Optional<Course> courseOpt = courseRepository.findById(id);
        if (courseOpt.isPresent()) {
            courseRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
    
    
}