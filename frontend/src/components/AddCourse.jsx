import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom"; 

const AddCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming 'user' provided from AuthContext
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    title: "",
    description: "",
    image: "",
    duration: "",
    level: "",
    ageRange: "",
    skillsImprove: "",
    video: "",
  });

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Convert skillsImprove to an array
    const skillsImproveArray = newCourse.skillsImprove
      ? newCourse.skillsImprove.split(",").map((skill) => skill.trim())
      : [];

    const videoArray = newCourse.video
      ? newCourse.video.split(",").map((videos) => videos.trim())
      : [];

    const courseData = {
      courseId: newCourse.courseCode,
      name: newCourse.title,
      description: newCourse.description,
      duration: newCourse.duration,
      level: newCourse.level,
      ageRange: newCourse.ageRange,
      video: videoArray,
      skillsImprove: skillsImproveArray,
      images: [newCourse.image],
    };

    // Send POST request with JWT token in the Authorization header
    axios
      .post("http://localhost:8080/courses/add", courseData, {
        headers: {
          'Authorization': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        alert("Course added successfully!");
        // Redirect to some other page after successful submission (like a course list page)
        navigate("/courses");
        // Reset the form
        setNewCourse({
          courseCode: "",
          title: "",
          description: "",
          image: "",
          duration: "",
          level: "",
          ageRange: "",
          skillsImprove: "",
          video: "",
        });
      })
      .catch((error) => {
        console.error("Error adding course:", error);
        alert("Failed to add course. Please try again.");
      });
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6">Add a New Course</h2>
      <form onSubmit={handleFormSubmit} className="bg-white shadow-lg p-6 rounded-lg space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Course Code</label>
          <input
            type="text"
            placeholder="Enter course code"
            name="courseCode"
            value={newCourse.courseCode}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            placeholder="Enter course title"
            name="title"
            value={newCourse.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            placeholder="Enter course description"
            name="description"
            value={newCourse.description}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Duration (Hours)</label>
          <input
            type="number"
            placeholder="Enter course duration"
            name="duration"
            value={newCourse.duration}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <input
            type="text"
            placeholder="Beginner, Intermediate, Advanced"
            name="level"
            value={newCourse.level}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Age Range</label>
          <input
            type="text"
            placeholder="e.g., 10-50 years"
            name="ageRange"
            value={newCourse.ageRange}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Skills Improved (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g., Baking, Knife Skills"
            name="skillsImprove"
            value={newCourse.skillsImprove}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            name="image"
            value={newCourse.image}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Video URL</label>
          <input
            type="text"
            placeholder="Enter video URL"
            name="video"
            value={newCourse.video}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
