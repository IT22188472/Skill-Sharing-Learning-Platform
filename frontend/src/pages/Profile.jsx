import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaHeart,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiMoreHorizontal, FiEye, FiEdit, FiTrash } from "react-icons/fi";
import { MdThumbUp } from "react-icons/md";

const Profile = () => {
  const { userid } = useParams();
  const { user } = useAuth();
  const [user1, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [course, setCourse] = useState(null);
  const [post, setPost] = useState(null);
  const [completeCourse, setCompleteCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab1, setActiveTab1] = useState("posts");
  const [activeTab2, setActiveTab2] = useState("Achivements");
  const [enrollments, setEnrollments] = useState(null);
  const token = localStorage.getItem("token");
  const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

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
      .get("http://localhost:8080/users/all")
      .then((response) => {
        setUsers(response.data);
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
      .get(`http://localhost:8080/courses/user/${userid}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((err) => {
        console.error("Error fetching Courses:", err);
      });

    axios
      .get(`http://localhost:8080/api/posts/user/${userid}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((err) => {
        console.error("Error fetching Posts:", err);
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

  const handleFollow = async (userId2) => {
    try {
      await axios.put(
        `http://localhost:8080/api/users/follow/${userId2}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      alert("Followed successfully!");
    } catch (err) {
      alert("Failed to follow user.");
      console.error("Follow error:", err.response || err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen relative top-[60px]">
      {/* Cover Photo */}
      <div className="h-[180px] w-[1520px] left-[0px] relative">
        <img
          src="/L.jpg"
          alt="Cover"
          className="w-full h-[230px] object-cover"
        />
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Profile Picture and Actions */}
        <div className="flex justify-between items-end relative -top-36 mb-4 -left-[280px]">
          <div className="flex items-end">
            <div className="relative left-[40px] top-[-30px]">
              <img
                src={
                  user1?.profileImage ||
                  "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                }
                alt="Profile"
                className="w-[150px] h-[150px] rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="ml-6 mb-4 relative top-[-70px] left-[50px]">
              <h1 className="text-5xl font-bold text-orange-300">
                {user1.firstName} {user1.lastName}
              </h1>
              <p className="text-white text-lg">
                @{user1.firstName.toLowerCase() + user1.lastName.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex space-x-3 mb-4 relative right-[430px] top-[-20px]">
            <button className="px-8 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
              Follow
            </button>
          </div>
        </div>

        {/* Bio and Stats */}
        <div className="mb-6">
          <p className="text-gray-800 mb-4 text-lg relative -left-[250px] top-[-100px]">
            Digital creator | Web developer | Lifelong learner | Sharing my
            journey in tech and education
          </p>

          <div className="flex flex-wrap text-gray-600 text-sm mb-4 relative -left-[250px] top-[-110px]">
            <div className="flex items-center mr-4 mb-2">
              <FaLink className="mr-1 text-xl" /> &nbsp;&nbsp;
              <a href="#" className="text-blue-500 text-xl hover:underline">
                {user1.email}
              </a>
            </div>
          </div>

          <div className="flex space-x-5 text-lg relative -left-[250px] top-[-120px]">
            <div className="flex items-center">
              <span className="font-bold text-gray-900 mr-1">
                {user1.following?.length || 0}
              </span>
              <span className="text-gray-600">Following</span>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;|
            <div className="flex items-center">
              <span className="font-bold text-gray-900 mr-1">
                {user1.followers?.length || 0}
              </span>
              <span className="text-gray-600">Followers</span>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;|
            <div className="flex items-center">
              <span className="font-bold text-gray-900 mr-1">
                {post?.length}
              </span>
              <span className="text-gray-600">Posts</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 mb-6 relative -left-[250px] top-[-120px]">
          <a href="#" className="text-gray-600 hover:text-blue-500">
            <FaTwitter size={25} />
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-700">
            <FaFacebook size={25} />
          </a>
          <a href="#" className="text-gray-600 hover:text-pink-600">
            <FaInstagram size={25} />
          </a>
        </div>

        <hr className="border-gray-300 mb-6 relative -left-[250px] top-[-120px] h-[3px] bg-gray-500 w-[1240px]" />
        <Link
          to={`/addcourse/${userid}`}
          className="btn btn-primary mb-3 absolute top-[220px] left-[-200px]"
        >
          Create New Course
        </Link>
        <br />
        <hr className="border-gray-300 mb-6 relative -left-[250px] top-[-120px] h-[2px] bg-gray-500 w-[1240px]" />

        {/* Tabs */}
        <div className="border-b border-gray-200 relative top-[-115px] left-[-250px] text-xl">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab1("posts")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab1 === "posts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              &nbsp;&nbsp;&nbsp;Posts&nbsp;&nbsp;&nbsp;
            </button>
            <button
              onClick={() => setActiveTab1("courses")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab1 === "courses"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              &nbsp;&nbsp;&nbsp;Courses&nbsp;&nbsp;&nbsp;
            </button>
            <button
              onClick={() => setActiveTab1("friends")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab1 === "friends"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              &nbsp;&nbsp;&nbsp;Friends&nbsp;&nbsp;&nbsp;
            </button>
            <button
              onClick={() => setActiveTab1("Achivements")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab1 === "Achivements"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              &nbsp;&nbsp;&nbsp;Archivements&nbsp;&nbsp;&nbsp;
            </button>
            <button
              onClick={() => setActiveTab1("Enroll")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab1 === "Enroll"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              &nbsp;&nbsp;&nbsp;Enrolled Courses&nbsp;&nbsp;&nbsp;
            </button>
            <button
              onClick={() => setActiveTab1("photos")}
              className={`py-4 px-1 border-b-2 font-medium text-lg ${
                activeTab1 === "photos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              &nbsp;&nbsp;&nbsp;Photos&nbsp;&nbsp;&nbsp;
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6 relative top-[-115px] left-[-250px] w-[1250px]">
          {activeTab1 === "posts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-3 gap-6">
              {post && post.length > 0 ? (
                post.map((post, index) => (
                  <a
                    key={index}
                    href={`/posts/${post.id}`}
                    className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    &nbsp;&nbsp;
                    <img
                      className="w-[250px] h-[130px] rounded-lg"
                      src={`http://localhost:8080${post.imageUrl}`}
                      alt={post.title || "Post image"}
                    />
                    <div className="flex w-[180px] h-[-10px] flex-col justify-between p-4 leading-normal">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-black dark:text-white">
                        {post.title || "Untitled Post"}
                      </h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {post.instructions?.split(" ").length > 5
                          ? post.instructions.split(" ").slice(0, 5).join(" ") +
                            "..."
                          : post.instructions || "No instructions available."}
                      </p>

                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        <MdThumbUp className="inline-block w-6 h-6 mr-1" />
                        &nbsp;&nbsp;{post.Liked?.length || 0}
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <div className="text-gray-400 mb-4">No Posts yet</div>
                </div>
              )}
            </div>
          )}

          {activeTab1 === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course && course.length > 0 ? (
                course.map((course, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >&nbsp;&nbsp;
                    <img
                      className="w-[300px] h-[120px] object-cover rounded-l-lg"
                      src={course.images[0]}
                      alt={course.name || "Post image"}
                    />
                    <div className="flex w-full flex-col justify-between p-4 leading-normal">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-black dark:text-white">
                        {course.name || "Untitled Post"}
                      </h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {course.description?.split(" ").length > 5
                          ? course.description
                              .split(" ")
                              .slice(0, 5)
                              .join(" ") + "..."
                          : course.description || "No instructions available."}
                      </p>

                      {/* Action buttons */}
                      <div className="flex space-x-6 mt-2 relative left-[0px] top-[0px]">
                        <a
                          href={`/course/${course.courseId}/${userid}`}
                          title="View Course"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEye size={15} />
                        </a>

                        <a
                          href={`/edit-course/${course.courseId}/${userid}`}
                          title="Edit Course"
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiEdit size={15} />
                        </a>

                        <button
                          onClick={() => handleDelete(course.courseId)}
                          title="Delete Course"
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <div className="text-gray-400 mb-4">No Courses yet</div>
                </div>
              )}
            </div>
          )}

          {activeTab1 === "friends" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 gap-1 w-[1050px]">
              {users && users.length > 0 ? (
                users.map((users, index) => (
                  <div key={index} className="p-2 rounded-lg">
                    <div class="w-[200px] bg-white border border-gray-200 rounded-lg ">
                      <div class="flex flex-col items-center pb-4 pt-4 w-[200px]">
                        <img
                          class="w-24 h-24 mb-3 rounded-full shadow-sm"
                          src={
                            users?.profileImage ||
                            "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                          }
                          alt="Bonnie image"
                        />
                        <h5 class="mb-1 text-lg font-medium text-gray-900 dark:text-black">
                          {users.firstName} {users.lastName}
                        </h5>
                        <span class="text-sm text-gray-500 dark:text-gray-400">
                          {users.email}
                        </span>
                        <div class="flex mt-4 md:mt-6">
                          <button
                            className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
                            onClick={() => handleFollow(users.id)}
                          >
                            Follow
                          </button>
                          <a
                            href={`/profile/${users.id}`}
                            class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <div className="text-gray-400 mb-4">No Users yet</div>
                </div>
              )}
            </div>
          )}

          {activeTab1 === "Achivements" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 gap-6">
              {completeCourse && completeCourse.length > 0 ? (
                completeCourse.map((completeCours, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow text-center"
                  >
                    {completeCours.course.level === "Beginner" && (
                      <img
                        src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Biginner_yaebnv.png"
                        alt="Beginner Badge"
                        className="w-24 h-24 mx-auto mb-3"
                      />
                    )}
                    {completeCours.course.level === "Intermediate" && (
                      <img
                        src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808778/Intermediate_o3ba9y.png"
                        alt="Intermediate Badge"
                        className="w-24 h-24 mx-auto mb-3"
                      />
                    )}
                    {completeCours.course.level === "Advanced" && (
                      <img
                        src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Advanced_x2xmg7.png"
                        alt="Advanced Badge"
                        className="w-24 h-24 mx-auto mb-3"
                      />
                    )}
                    <h3 className="font-bold">{completeCours.course.name}</h3>
                    <p className="text-gray-600 text-sm capitalize">
                      {completeCours.course.level}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <div className="text-gray-400 mb-4">No Achievements yet</div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Explore Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab1 === "photos" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((photo) => (
                <div
                  key={photo}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={`https://picsum.photos/400/400?random=${photo}`}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab1 === "Enroll" && (
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-4">
              {enrollments && enrollments.length > 0 ? (
                enrollments.map((enrollment, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div className="relative h-40 bg-gray-200">
                      <img
                        src={
                          enrollment.image ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={enrollment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{enrollment.name}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">
                          In Progress
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          10%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                      <Link
                        to={`/enrollments/${enrollment.courseId}/${userid}`}
                        className="block mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <div className="text-gray-400 mb-4">
                    No enrolled courses yet
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
