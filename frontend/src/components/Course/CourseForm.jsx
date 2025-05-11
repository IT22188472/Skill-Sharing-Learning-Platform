import React, { useEffect, useState, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import axios from "axios";
<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.min.css";
=======
//import "bootstrap/dist/css/bootstrap.min.css";
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
import cooking1 from "../../images/cooking4.jpg";
import Nav from "../../pages/nav";
const userId = localStorage.getItem("userId");

const CourseForm = () => {
  // State for courses
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const exploreCoursesRef = useRef(null);
  const handleScrollToCourses = () => {
    exploreCoursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch courses from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/courses/active")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));

    axios
      .get(`http://localhost:8080/users/${id}`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div>
      {/* Hero Section with Navigation Bar on Top */}
      <div
        className="position-relative text-white text-center bg-dark"
        style={{
          background: `url(${cooking1}) no-repeat center center / cover`,
          height: "440px",
        }}
      >
        {/* Navigation Bar inside Hero Section */}
        <br />
        <Nav />

        {/* Hero Content */}
        <div
          className=""
          style={{ position: "relative", top: "200px", left: "-200px" }}
        >
          <div className=" bg-opacity-50 p-4 rounded position-absolute top-50 start-50 translate-middle ">
            <h1 className="display-4 fw-bold">Taste the Learning Journey.</h1>
            <br />
            <br />
            <h4
              classname="display-5 fw-bold left-align"
              style={{
                position: "relative",
                top: "0px",
                textAlign: "left",
                left: "135px",
                width: "800px",
              }}
            >
              Welcome to FlavorFlow, the ultimate platform where passion meets
              learning.
              <br />
              Discover new skills, share your own, and grow together in a
              vibrant, flavorful community.
              <br />
              <br />
              <h4>Start Your Journey | 🚀 Join the Flavorflow</h4>
              <br />
              <Button
                className="btn btn-primary rounded-pill fw-bold m-2"
                style={{ width: "180px", height: "40px", fontSize: "16px" }}
                onClick={handleScrollToCourses}
              >
                Explore Courses
              </Button>
            </h4>
          </div>
        </div>
      </div>

      {/* Content Section (Sidebar + Courses) */}
      <div className="container py-5">
        <div className="row">
          {/* Left Column (Sidebar) */}
          <div className="col-md-4 mb-4">
            <div
              className="bg-light p-3 rounded-5 shadow-sm"
              style={{
                width: "55%",
                minHeight: "380px",
                position: "sticky",
                top: "20px",
                left: "160px",
              }}
            >
              <h2 className="fw-bold mb-2 text-2xl text-center">Profile</h2>
              <div className="text-center">
                <img
                  src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                  alt="User"
                  className="rounded-circle shadow-sm"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    position: "relative",
                    left: "70px",
                  }}
                />
                <br />
                <b>
                  <Link to={`/profile/${users.id}`}>
                    <h1 className="text-xl font-bold hover:text-blue-500 transition-colors duration-200">
                      {users.firstName} {users.lastName}
                    </h1>
                  </Link>
                </b>
              </div>
              <br />
              <div className="d-grid gap-4">
                <HashLink
                  to={`/profile/${users.id}/#enrolled-courses`}
                  className="btn btn-primary"
                >
                  Enrolled Courses
                </HashLink>
                <Link to="/progress" className="btn btn-secondary">
                  Progress
                </Link>
                <HashLink to={`/profile/${users.id}/#Achievements`} className="btn btn-success">
                  Achievements
                </HashLink>
              </div>
            </div>
          </div>

          {/* Right Column (Courses) */}
          <div
            className="w-full md:w-[60%]  "
            style={{ position: "relative", left: "-60px" }}
            ref={exploreCoursesRef}
          >
            <h2 className="text-3xl font-bold text-center mb-6">
              Explore Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.courseId} className="">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <img
                        src={
                          course.images && course.images.length > 0
                            ? course.images[0]
                            : "https://img.freepik.com/free-psd/delicious-spaghetti-dish-with-fresh-ingredients-pan-with-transparent-background_84443-25952.jpg?semt=ais_hybrid&w=740"
                        }
                        alt={course.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {course.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {course.description.length > 100
                            ? course.description.slice(0, 100) + "..."
                            : course.description}
                        </p>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          <strong>Level:</strong> {course.level}
                        </p>
                        <p className="text-sm font-medium text-gray-800 mb-4">
                          <strong>Duration:</strong> {course.duration} hours
                        </p>
                        <Link
                          to={`/course/${course.courseId}/${users.id}`}
                          className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center w-full">No courses available.</p>
              )}
            </div>
          </div>
        </div>
        {/* Link to the add course page */}
        <Link to={`/ContentDashboard/${users.id}`}>
          <Button variant="primary" className="mt-4">
            Content Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseForm;
