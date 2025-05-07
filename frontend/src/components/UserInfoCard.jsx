import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";

const UserInfoCard = ({ user }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [completeCourse, setCompleteCourse] = useState([]);
  const [badgeCount, setBadgeCount] = useState({
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0,
  });

  useEffect(() => {
    if (user?.id) {
      // Fetch Enrollments
      axios
        .get(`http://localhost:8080/enrollments/user/${user.id}`)
        .then((response) => {
          setEnrollments(response.data);
        })
        .catch((err) => {
          console.error("Error fetching enrollments:", err);
        });

      // Fetch Completed Courses
      axios
        .get(`http://localhost:8080/completedcourses/user/${user.id}`)
        .then((response) => {
          const courses = response.data;
          setCompleteCourse(courses);

          // Calculate badge count based on course levels
          const count = {
            Beginner: 0,
            Intermediate: 0,
            Advanced: 0,
          };

          courses.forEach((course) => {
            if (course?.course?.level === "Beginner") count.Beginner += 1;
            if (course?.course?.level === "Intermediate")
              count.Intermediate += 1;
            if (course?.course?.level === "Advanced") count.Advanced += 1;
          });

          setBadgeCount(count);
        })
        .catch((err) => {
          console.error("Error fetching Completed Courses:", err);
        });
    }
  }, [user?.id]);

  return (
    <div className="fixed top-[85px] left-[30px] w-[280px] h-[670px] bg-gary-200 overflow-y-auto space-y-4 z-50 pr-2 rounded-2xl scrollbar-thin scrollbar-thumb-gray-200">
      {/* Profile Card */}
      <div className="bg-gray-200 rounded-2xl  p-6 text-center">
        <p className="mt-2 text-sm text-gray-600 px-2">
          Welcome back! <br />
          Ready to share another delicious recipe?
        </p>
        <br />
        <img
          src={
            user?.profileImage ||
            "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          }
          alt="User Avatar"
          className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-gray-200 shadow-md"
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {user?.firstName} {user?.lastName || "Anonymous"}
        </h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <div className="flex justify-center gap-6 my-3 text-sm text-gray-700">
          <div>
            <span className="font-bold">{user?.followers?.length || 0}</span>
            <br />
            <span className="text-xs text-gray-400">Followers</span>
          </div>
          <div>
            <span className="font-bold">{user?.following?.length || 0}</span>
            <br />
            <span className="text-xs text-gray-400">Following</span>
          </div>
        </div>
        <button>
          <Link
            to={`/profile/${user.id}`}
            className="btn btn-primary rounded-2xl"
            style={{ width: "100px" }}
          >
            Profile
          </Link>
        </button>

        <br />
        <br />
        <hr
          style={{ height: "3px", backgroundColor: "#333", border: "none" }}
        />
        <br />
        <b>Achivements</b>
        <p />
        <div className="flex justify-center gap-4">
          {completeCourse.length > 0 ? (
            <>
              <div className="flex items-center justify-center flex-col">
                <img
                  src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Biginner_yaebnv.png"
                  alt="Beginner Badge"
                  className="w-[50px] h-[50px]"
                />
                <span>{badgeCount.Beginner}</span>
              </div>
              <div className="flex items-center justify-center flex-col">
                <img
                  src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808778/Intermediate_o3ba9y.png"
                  alt="Intermediate Badge"
                  className="w-[50px] h-[50px]"
                />
                <span>{badgeCount.Intermediate}</span>
              </div>
              <div className="flex items-center justify-center flex-col">
                <img
                  src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Advanced_x2xmg7.png"
                  alt="Advanced Badge"
                  className="w-[50px] h-[50px]"
                />
                <span>{badgeCount.Advanced}</span>
              </div>
            </>
          ) : (
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-dark text-2xl font-semibold">
                No completed courses found
              </span>
            </div>
          )}
        </div>
        <br />
        <hr
          style={{ height: "3px", backgroundColor: "#333", border: "none" }}
        />
        <br />
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Enrolled Courses ({enrollments.length})
        </h3>
        <div className="grid grid-cols-4 gap-3 justify-center">
          {enrollments.length > 0 ? (
            enrollments.map((enrollment, index) => (
              <div
                key={index}
                className="relative bg-gray-300 rounded-full overflow-hidden"
                style={{ width: "50px", height: "50px" }}
              >
                <Link
                  to={`/enrollments/${enrollment.courseId}/${user.id}`}
                  className="block w-full h-full"
                >
                  <img
                    src={enrollment.image || "https://via.placeholder.com/90"}
                    alt="Enrollment"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-dark text-sm font-semibold">
                No enrollments found
              </span>
            </div>
          )}
        </div>
        <HashLink
          to={`/profile/${user.id}/#enrolled-courses`}
          className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          View All Courses
        </HashLink>
      </div>
    </div>
  );
};

export default UserInfoCard;
