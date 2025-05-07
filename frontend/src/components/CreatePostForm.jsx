import React, { useState } from 'react';
import axios from 'axios';

const AddCourse = () => {
  const [newCourse, setNewCourse] = useState({
    courseCode: '',
    title: '',
    description: '',
    image: null,
    duration: '',
    level: '',
    ageRange: '',
    skillsImprove: '',
    video: null
  });

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Handle file change for image/video
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewCourse({ ...newCourse, [name]: files[0] });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Convert skillsImprove to an array
    const skillsImproveArray = newCourse.skillsImprove
      ? newCourse.skillsImprove.split(',').map((skill) => skill.trim())
      : [];

    const formData = new FormData();
    formData.append('courseId', newCourse.courseCode);
    formData.append('name', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('duration', newCourse.duration);
    formData.append('level', newCourse.level);
    formData.append('ageRange', newCourse.ageRange);
    formData.append('video', newCourse.video); // Append video file
    formData.append('skillsImprove', JSON.stringify(skillsImproveArray));
    formData.append('image', newCourse.image); // Append image file

    axios
      .post('http://localhost:8080/courses/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        alert('Course added successfully!');
        setNewCourse({
          courseCode: '',
          title: '',
          description: '',
          image: null,
          duration: '',
          level: '',
          ageRange: '',
          skillsImprove: '',
          video: null
        });
      })
      .catch((error) => console.error('Error adding course:', error));
  };

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Add a New Course</h2>
      <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Course Code</label>
            <input
              type="text"
              placeholder="Enter course code"
              name="courseCode"
              value={newCourse.courseCode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Course Title</label>
            <input
              type="text"
              placeholder="Enter course title"
              name="title"
              value={newCourse.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Description</label>
            <textarea
              rows={3}
              placeholder="Enter course description"
              name="description"
              value={newCourse.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Duration (Hours)</label>
            <input
              type="number"
              placeholder="Enter course duration"
              name="duration"
              value={newCourse.duration}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Level</label>
            <input
              type="text"
              placeholder="Beginner, Intermediate, Advanced"
              name="level"
              value={newCourse.level}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Age Range</label>
            <input
              type="text"
              placeholder="e.g., 10-50 years"
              name="ageRange"
              value={newCourse.ageRange}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Skills Improved (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Baking, Knife Skills"
              name="skillsImprove"
              value={newCourse.skillsImprove}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Image Upload</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">Video Upload</label>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
