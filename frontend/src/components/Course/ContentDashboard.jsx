import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from "sweetalert2";
import Nav1 from "../../pages/nav_1";

const ContentDashboard = () => {
  const { id } = useParams();
  const userid = id;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/courses/all");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      fetchCourses();
      setIsSearching(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/courses/${searchId}`
      );
      setCourses([response.data]);
      setIsSearching(true);
    } catch (error) {
      console.error("Course not found:", error);
      setCourses([]);
    }
  };

  const handleToggleStatus = async (courseId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to mark this course as "${newStatus}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, make it ${newStatus}`,
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:8080/courses/update/status/${courseId}`,
          { status: newStatus }
        );
        setCourses(
          courses.map((course) =>
            course.courseId === courseId
              ? { ...course, status: newStatus }
              : course
          )
        );
        Swal.fire("Updated!", `Course is now ${newStatus}.`, "success");
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const handleDelete = (courseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/courses/coursesdelete/${courseId}`)
          .then(() => {
            Swal.fire("Deleted!", "The course has been deleted.", "success");
            // Refresh the course list after deletion
            setCourses((prevCourses) =>
              prevCourses.filter((course) => course.courseId !== courseId)
            );
          })
          .catch((error) => {
            Swal.fire("Error!", "Failed to delete the course.", "error");
            console.error("Delete error:", error);
          });
      }
    });
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setFormData({ ...course });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
    setIsEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    const skillsArray = value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skillsImprove: skillsArray }));
  };

  const handleSubmitUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/courses/update/${formData.courseId}`,
        formData
      );
      setCourses(
        courses.map((course) =>
          course.courseId === formData.courseId ? { ...formData } : course
        )
      );
      setSelectedCourse({ ...formData });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const totalCourses = courses.length;
  const activeCourses = courses.filter(
    (course) => course.status === "active"
  ).length;
  const inactiveCourses = courses.filter(
    (course) => course.status === "inactive"
  ).length;

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading courses...</p>
      </div>
    );

  return (
    <div className="w-[90%] mx-auto mt-5">
      <Nav1 />
      <h1 className="my-1 font-extrabold text-gray-900 text-4xl">
        &nbsp;&nbsp;&nbsp;Content Creator Dashboard
      </h1>
      <br />

      <span
        className="badge bg-primary fs-6"
        style={{
          width: "150px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          left: "730px",
          top: "95px",
        }}
      >
        <h5 className="mb-0">Total Courses: {totalCourses}</h5>
      </span>

      <span
        className="badge bg-success fs-6"
        style={{
          width: "150px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          left: "900px",
          top: "95px",
        }}
      >
        <h5 className="mb-0">Active Courses: {activeCourses}</h5>
      </span>

      <span
        className="badge bg-danger fs-6"
        style={{
          width: "150px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          left: "1070px",
          top: "95px",
        }}
      >
        <h5 className="mb-0">Inactive Courses: {inactiveCourses}</h5>
      </span>

      <hr
        style={{
          border: "0",
          height: "6px",
          backgroundImage:
            "linear-gradient(to right,rgb(255, 11, 3),rgb(27, 237, 72))",
          borderRadius: "8px",
          margin: "1rem 0",
        }}
      />

      {/* Search Section */}
      <div className="mb-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by Course ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn btn-secondary me-2" onClick={handleSearchById}>
          Search
        </button>
        {isSearching && (
          <button
            className="btn btn-outline-dark"
            onClick={() => {
              fetchCourses();
              setSearchId("");
              setIsSearching(false);
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Level</th>
            <th>Age Range</th>
            <th>Skills Improved</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseId}</td>
                <td class="border px-1 py-2 max-w-sm overflow-auto">
                  {course.name}
                </td>
                <td className="border px py-2 max-w-sm overflow-auto">
                  {course.description.length > 100
                    ? course.description.substring(0, 100) + "..."
                    : course.description}
                </td>

                <td class="border px-1 py-2 max-w-sm overflow-auto">
                  {course.duration} hours
                </td>
                <td class="border px-1 py-2 max-w-sm overflow-auto">
                  {course.level}
                </td>
                <td class="border px-1 py-2 max-w-sm overflow-auto">
                  {course.ageRange}
                </td>
                <td class="border px-1 py-2 max-w-sm overflow-auto">
                  {course.skillsImprove?.join(", ")}
                </td>
                <td class="border px-1 py-2 max-w-sm overflow-auto">
                  {course.images?.[0] && (
                    <img
                      src={course.images[0]}
                      alt="Course"
                      style={{
                        height: "50px",
                        width: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>
                  <Link
                    to={`/course/${course.courseId}/${userid}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    View
                  </Link>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setIsEditMode(true);
                      handleViewCourse(course);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(course.courseId)}
                  >
                    Delete
                  </button>
                  <button
                    className={`btn btn-sm me-2 ${
                      course.status === "active" ? "btn-success" : "btn-danger"
                    }`}
                    onClick={() =>
                      handleToggleStatus(course.courseId, course.status)
                    }
                  >
                    {course.status === "active" ? "Activated" : " Inacvated "}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No course found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link
        to={`/addcourse/${id}`}
        className="btn btn-primary mb-3 absolute top-90 right-20"
      >
        Create New Course
      </Link>
      <br />

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-100w"
        className="custom-modal"
        animation={false}
        backdropClassName="custom-backdrop"
        centered
        style={{ maxWidth: "100vw", margin: "0 auto" }}
        contentClassName="custom-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-full text-center text-xl font-semibold">
            {isEditMode ? "Edit Course" : formData.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isEditMode ? (
            <>
              {/* Description, Code, and Name in One Row */}
              <div className="flex flex-wrap mb-3">
                <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
                  <label className="font-semibold">Code:</label>
                  <input
                    name="code"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    placeholder="Enter course code"
                  />
                </div>
                <div className="w-full md:w-2/3 px-3 mb-4 md:mb-0">
                  <label className="font-semibold">Name:</label>
                  <input
                    name="name"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter course name"
                  />
                </div>
                <div className="w-full  px-3">
                  <label className="font-semibold">Description:</label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description"
                    rows="5"
                  />
                </div>
              </div>

              {/* Duration, Age Range, Skills in Two Columns */}
              <div className="flex flex-wrap mb-3">
                <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                  <label className="font-semibold">Duration (hrs):</label>
                  <input
                    type="number"
                    name="duration"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Enter course duration in hours"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="font-semibold">Age Range:</label>
                  <input
                    name="ageRange"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    placeholder="Enter age range"
                  />
                </div>
              </div>

              {/* Skills and Status Fields */}
              <div className="flex flex-wrap mb-3">
                <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                  <label className="font-semibold">
                    Skills (comma-separated):
                  </label>
                  <input
                    name="skillsImprove"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.skillsImprove?.join(", ")}
                    onChange={handleSkillsChange}
                    placeholder="Enter skills to improve"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="font-semibold">Status:</label>
                  <select
                    name="status"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Level Dropdown and Active/Inactive Checkbox */}
              <div className="flex flex-wrap mb-3">
                <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                  <label className="font-semibold">Level:</label>
                  <select
                    name="level"
                    className="w-full px-4 py-2 border rounded-md"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="font-semibold">Image:</label>
                  {selectedCourse.images?.[0] && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={formData.images[0]}
                        alt="Course"
                        className="rounded-lg w-1/3 sm:w-3/4 md:w-3/6"
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                className="w-full bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={handleSubmitUpdate}
              >
                Save Changes
              </button>
            </>
          ) : selectedCourse ? (
            <div className="space-y-6 p-6 border-2 border-gray-300 rounded-lg max-w-4xl mx-auto bg-white shadow-xl hover:shadow-2xl transition-all ease-in-out duration-300">
  {selectedCourse.images?.[0] && (
    <div className="flex justify-center mb-6">
      <img
        src={selectedCourse.images[0]}
        alt="Course"
        className="rounded-lg w-full sm:w-1/2 md:w-2/3 lg:w-1/4 shadow-lg"
      />
    </div>
  )}

  <div className="space-y-4">
    {/* Course Code */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseCode" className="text-lg font-semibold text-gray-700">
        Course Code:
      </label>
      <input
        id="courseCode"
        type="text"
        value={selectedCourse.courseId}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>

    {/* Course Name */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseName" className="text-lg font-semibold text-gray-700">
        Course Name:
      </label>
      <input
        id="courseName"
        type="text"
        value={selectedCourse.name}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>

    {/* Course Description */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseDescription" className="text-lg font-semibold text-gray-700">
        Description:
      </label>
      <textarea
        id="courseDescription"
        value={selectedCourse.description}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
        rows="3"
      />
    </div>

    {/* Duration */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseDuration" className="text-lg font-semibold text-gray-700">
        Duration:
      </label>
      <input
        id="courseDuration"
        type="number"
        value={selectedCourse.duration}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>

    {/* Level */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseLevel" className="text-lg font-semibold text-gray-700">
        Level:
      </label>
      <input
        id="courseLevel"
        type="text"
        value={selectedCourse.level}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>

    {/* Age Range */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseAgeRange" className="text-lg font-semibold text-gray-700">
        Age Range:
      </label>
      <input
        id="courseAgeRange"
        type="text"
        value={selectedCourse.ageRange}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>

    {/* Skills Improved */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseSkills" className="text-lg font-semibold text-gray-700">
        Skills Improved:
      </label>
      <input
        id="courseSkills"
        type="text"
        value={selectedCourse.skillsImprove?.join(", ")}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>

    {/* Status */}
    <div className="flex justify-between items-center">
      <label htmlFor="courseStatus" className="text-lg font-semibold text-gray-700">
        Status:
      </label>
      <input
        id="courseStatus"
        type="text"
        value={selectedCourse.status}
        readOnly
        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-2/3 text-gray-600"
      />
    </div>
  </div>
</div>

          ) : null}
        </Modal.Body>

        <Modal.Footer>
          {!isEditMode && (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <br />
      <hr
        style={{
          border: "0",
          height: "6px",
          backgroundImage:
            "linear-gradient(to right,rgb(255, 11, 3),rgb(27, 237, 72))",
          borderRadius: "8px",
          margin: "1rem 0",
        }}
      />
    </div>
  );
};

export default ContentDashboard;
