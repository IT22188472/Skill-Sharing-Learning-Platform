import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditCourse = () => {
  const { courseId, userid } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    level: "",
    ageRange: "",
    skillsImprove: [],
    images: [],
    status: "active",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/courses/${courseId}`
        );
        const course = response.data;
        setFormData({
          ...course,
          skillsImprove: course.skillsImprove || [],
          images: course.images || [],
        });
      } catch (error) {
        console.error("Error fetching course:", error);
        Swal.fire("Error", "Could not load course", "error");
        navigate("/dashboard");
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, skillsImprove: skillsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/courses/update/${courseId}`,
        formData
      );
      Swal.fire("Success", "Course updated successfully", "success");
      navigate(`/profile/${userid}`);
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update course", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      {formData.images.length > 0 && (
        <div className="w-[1520px] relative left-[-490px]">
        <img
          src={formData.images[0]}
          alt={formData.name}
          className="w-full h-[300px] object-cover opacity-90"
        />
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            name="duration"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <input
            type="text"
            name="level"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.level}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Range
          </label>
          <input
            type="text"
            name="ageRange"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.ageRange}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.skillsImprove.join(", ")}
            onChange={handleSkillsChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
