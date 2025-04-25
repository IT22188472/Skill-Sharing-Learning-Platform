import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    title: "",
    description: "",
    duration: "",
    level: "",
    ageRange: "",
    skillsImprove: "",
    video: "",
    status: "active",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("courseCode", newCourse.courseCode);
    formData.append("name", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("duration", newCourse.duration);
    formData.append("level", newCourse.level);
    formData.append("ageRange", newCourse.ageRange);
    formData.append("status", newCourse.status);
    formData.append("skillsImprove", newCourse.skillsImprove); // comma-separated
    formData.append("video", newCourse.video); // comma-separated

    // Append all images
    imageFiles.forEach((file) => formData.append("images", file));
    videoFiles.forEach((file) => formData.append("videos", file));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/courses/add", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course added successfully!");
      navigate(`/ContentDashboard/${id}`);

      // Reset
      setNewCourse({
        courseCode: "",
        title: "",
        description: "",
        duration: "",
        level: "",
        ageRange: "",
        skillsImprove: "",
        video: "",
        status: "active",
      });
      setImageFiles([]);
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6">Add a New Course</h2>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white shadow-lg p-6 rounded-lg space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <input
            type="text"
            name="courseCode"
            value={newCourse.courseCode}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={newCourse.title}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={newCourse.description}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration (Hours)
          </label>
          <input
            type="number"
            name="duration"
            value={newCourse.duration}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <input
            type="text"
            name="level"
            value={newCourse.level}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age Range
          </label>
          <input
            type="text"
            name="ageRange"
            value={newCourse.ageRange}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills Improved (comma-separated)
          </label>
          <input
            type="text"
            name="skillsImprove"
            value={newCourse.skillsImprove}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Videos
          </label>
          <input
            type="file"
            name="videos"
            multiple
            accept="video/*"
            onChange={(e) => setVideoFiles([...e.target.files])}
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Images
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
