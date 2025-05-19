import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Landing9 from "../../images/Landing11.jpg";

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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Generate image preview URLs
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(imageURLs);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles(files);

    // Generate video preview URLs
    const videoURLs = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews(videoURLs);
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
    formData.append("skillsImprove", newCourse.skillsImprove);
    formData.append("video", newCourse.video);

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

      // Reset form
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
      setVideoFiles([]);
      setImagePreviews([]);
      setVideoPreviews([]);
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    }
  };

  return (
    <div>
      <img
        src={Landing9}
        alt="Cover"
        className="w-full h-[780px] object-cover mx-auto"
      />
      <div className="max-w-[800px] mx-auto p-8 relative top-[-680px] left-[250px] bg-gray-50 opacity-90 shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">
          Add a New Course
        </h2>

        <form
          onSubmit={handleFormSubmit}
          className="bg-transparent shadow-xl  rounded-xl space-y-2 opacity-100"
          encType="multipart/form-data"
        >
          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={newCourse.courseCode}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={newCourse.title}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={newCourse.description}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Duration (Hours)
              </label>
              <input
                type="number"
                name="duration"
                value={newCourse.duration}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Level
              </label>
              <select
                name="level"
                value={newCourse.level}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Age Range
              </label>
              <select
                name="ageRange"
                value={newCourse.ageRange}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Age Range</option>
                <option value="10-18">10-18 years</option>
                <option value="18-30">18-30 years</option>
                <option value="30+">30+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Skills Improved (comma-separated)
              </label>
              <input
                type="text"
                name="skillsImprove"
                value={newCourse.skillsImprove}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Upload Images
              </label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md p-2"
              />

              {/* Image Preview */}
              <div className="flex flex-wrap mt-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Upload Videos
              </label>
              <input
                type="file"
                name="videos"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full border rounded-md p-2"
              />

              {/* Video Preview */}
              <div className="flex flex-wrap mt-4 gap-4">
                {videoPreviews.map((src, index) => (
                  <video
                    key={index}
                    src={src}
                    controls
                    className="w-32 h-24 rounded-md border"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
