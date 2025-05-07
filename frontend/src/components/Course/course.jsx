import React, { useState } from "react";
import axios from "axios";

const AddCourse = () => {
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    title: "",
    description: "",
    duration: "",
    level: "",
    ageRange: "",
    skillsImprove: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const skillsImproveArray = newCourse.skillsImprove
      ? newCourse.skillsImprove.split(",").map((skill) => skill.trim())
      : [];

    const formData = new FormData();
    formData.append("courseId", newCourse.courseCode);
    formData.append("name", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("duration", newCourse.duration);
    formData.append("level", newCourse.level);
    formData.append("ageRange", newCourse.ageRange);
    formData.append("skillsImprove", JSON.stringify(skillsImproveArray));
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      await axios.post("http://localhost:8080/courses/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Course added successfully!");
      setNewCourse({
        courseCode: "",
        title: "",
        description: "",
        duration: "",
        level: "",
        ageRange: "",
        skillsImprove: "",
      });
      setImageFile(null);
      setVideoFile(null);
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Add a New Course
      </h2>
      <div className="bg-white shadow-xl rounded-xl p-8 space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              type="text"
              name="courseCode"
              value={newCourse.courseCode}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newCourse.title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={newCourse.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="text"
              name="duration"
              value={newCourse.duration}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              type="text"
              name="level"
              value={newCourse.level}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Age Range</label>
            <input
              type="text"
              name="ageRange"
              value={newCourse.ageRange}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Skills to Improve (comma-separated)</label>
            <input
              type="text"
              name="skillsImprove"
              value={newCourse.skillsImprove}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Video</label>
            <input
              type="file"
              onChange={handleVideoChange}
              accept="video/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
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
