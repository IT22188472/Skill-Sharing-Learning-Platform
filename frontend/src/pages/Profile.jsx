import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [completeCourse, setCompleteCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab1, setActiveTab1] = useState("posts");
  const [activeTab2, setActiveTab2] = useState("Achivements");
  const [enrollments, setEnrollments] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/${userid}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    axios
      .get(`http://localhost:8080/enrollments/user/${userid}`)
      .then((response) => {
        setEnrollments(response.data);
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
      });

    axios
      .get(`http://localhost:8080/courses/${userid}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((err) => {
        console.error("Error fetching Courses:", err);
      });

    axios
      .get(`http://localhost:8080/completedcourses/user/${userid}`)
      .then((response) => {
        console.log("Completed Courses:", response.data);
        setCompleteCourse(response.data);
      })
      .catch((err) => {
        console.error("Error fetching Completed Courses:", err);
      });
  }, []);

  // Loading and error handling
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="relative">
            <img
              src="https://storage.needpix.com/rsynced_images/sunset-profile-background.jpg"
              alt="Cover"
              className="w-full h-64 object-cover"
            />
            {/* Profile Picture */}
            <div
              className="absolute top-32 left-4"
              style={{ position: "absolute", top: "50px", left: "40px" }}
            >
              <img
                src="https://play-lh.googleusercontent.com/vco-LT_M58j9DIAxlS1Cv9uvzbRhB6cYIZJS7ocZksWRqoEPat_QXb6fVFi77lciJZQ=w526-h296-rw"
                alt="Profile"
                className="w-80 h-80 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
              </h1>

              <p className="text-xl font-bold text-gray-500">{user.email}</p>
              <p className="text-gray-500 mt-2">
                {user.gender.charAt(0).toUpperCase() +
                  user.gender.slice(1).toLowerCase()}
              </p>

              {/* Bio */}
              <div className="mt-4">
                <p className="text-gray-700 text-lg">
                  This is a bio of the user. Replace this with actual data
                  later.
                </p>
              </div>

              {/* Follow/Unfollow Button */}
              <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-600 transition duration-300">
                Follow
              </button>

              {/* Social Links */}
              <div className="mt-6 flex justify-center space-x-6">
                <a
                  href="https://twitter.com"
                  className="text-blue-500 hover:text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter text-5xl"></i>
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a
                  href="https://facebook.com"
                  className="text-blue-600 hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook text-5xl"></i>
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a
                  href="https://instagram.com"
                  className="text-pink-600 hover:text-pink-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram text-5xl"></i>
                </a>
              </div>
            </div>

            {/* Followers and Following */}
            <div className="flex justify-between mt-8">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700">
                  {user.followers?.length || 0}
                </p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700">
                  {user.following?.length || 0}
                </p>
                <p className="text-gray-500">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile1 Tabs */}
        <div className="mt-8 bg-white shadow-lg rounded-xl">
          <div className="flex justify-around p-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab1("posts")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab1 === "posts"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab1("friends")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab1 === "friends"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab1("photos")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab1 === "photos"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              Photos
            </button>
          </div>

          {/* Tab1 Content */}
          <div className="p-6">
            {activeTab1 === "posts" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Recent Posts
                </h2>
                <div className="mt-4">
                  {/* Sample Posts */}
                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Post Title 1
                    </h3>
                    <p className="text-gray-600 mt-2">
                      This is an example of a post content. Feel free to explore
                      more posts by this user.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Post Title 2
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Another post with some engaging content.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab1 === "friends" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Friends</h2>
                <div className="mt-4">
                  {/* Sample Friends */}
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                    <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                    <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab1 === "photos" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Photos</h2>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {/* Sample Photos */}
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                  <div className="w-full h-32 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile2 Tabs */}
        <div className="mt-8 bg-white shadow-lg rounded-xl">
          <div className="flex justify-around p-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab2("Achivements")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab2 === "posts"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              Achivements
            </button>
            <button
              id="Achievements"
              onClick={() => setActiveTab2("Completed")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab2 === "friends"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              Completed Courses
            </button>
            <button
              id="enrolled-courses"
              onClick={() => setActiveTab2("Enroll")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab2 === "photos"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
            >
              Enroll Courses
            </button>
          </div>

          {/* Tab2 Content */}
          <div className="p-6">
            {activeTab2 === "Achivements" && (
              <div className="mt-2 grid grid-cols-10 gap-0">
                {completeCourse && completeCourse.length > 0 ? (
                  completeCourse.map((completeCours, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-0  flex items-center justify-center"
                      style={{
                        width: "100px",
                        height: "100px",
                        position: "relative",
                        top: "-30px",
                        left: "20px",
                      }}
                    >
                      <div className="absolute bottom-0 left-0">
                        {completeCours.course.level === "Beginner" && (
                          <img
                            src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Biginner_yaebnv.png"
                            alt="Beginner Badge"
                            className="w-20 h-20 "
                          />
                        )}
                        {completeCours.course.level === "Intermediate" && (
                          <img
                            src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808778/Intermediate_o3ba9y.png"
                            alt="Intermediate Badge"
                            className="w-20 h-20"
                          />
                        )}
                        {completeCours.course.level === "Advanced" && (
                          <img
                            src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Advanced_x2xmg7.png"
                            alt="Advanced Badge"
                            className="w-20 h-20 "
                          />
                        )}
                        <div
                          className="absolute text-dark font-bold text-sm p-1  bg-opacity-90 rounded-full flex items-center justify-center"
                          style={{
                            textAlign: "center",
                            left: "50%",
                            top: "70px",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <b>{completeCours.course.name}</b>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-dark text-2xl font-semibold">
                      No completed courses found
                    </span>
                  </div>
                )}
              </div>
            )}
            {activeTab2 === "Completed" && (
              <div className="mt-2 grid grid-cols-8 gap-0">
                {completeCourse && completeCourse.length > 0 ? (
                  completeCourse.map((completeCours, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-300 rounded-full flex items-center justify-center"
                      style={{ width: "90px", height: "90px" }}
                    >
                      <img
                        src={completeCours.course.images[0]}
                        alt={completeCours.course.name}
                        className="img-fluid rounded-full object-cover opacity-100"
                        style={{ width: "100%", height: "100%" }}
                      />
                      <div className="absolute text-dark font-bold text-xs p-1 bg-white bg-opacity-90 rounded-full">
                        <b>{completeCours.course.name}</b>{" "}
                        {/* Ensure 'name' is the correct property */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-dark text-2xl font-semibold">
                      No completed courses found
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab2 === "Enroll" && (
              <div className="mt-2 grid grid-cols-8 gap-0">
                {enrollments && enrollments.length > 0 ? (
                  enrollments.map((enrollment, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-300 rounded-full flex items-center justify-center"
                      style={{ width: "90px", height: "90px" }}
                    >
                      <Link
                        to={`/enrollments/${enrollment.courseId}/${userid}`}
                        className="block w-full h-full"
                      >
                        <img
                          src={enrollment.image}
                          alt="Enrollment Image"
                          className="img-fluid rounded-full object-cover opacity-100"
                          style={{ width: "100%", height: "100%" }}
                        />
                        <div
                          className="absolute text-dark font-bold text-xs p-1 bg-white bg-opacity-90 rounded-full"
                          style={{
                            position: "absolute",
                            top: "35px",
                            left: "10px",
                          }}
                        >
                          <b>{enrollment.name}</b>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-dark text-2xl font-semibold">
                      No enrollments found
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
