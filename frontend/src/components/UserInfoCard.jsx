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
    <div className="fixed top-[85px] left-[180px] w-[250px] h-[670px] overflow-y-auto space-y-4 z-50 pr-2 rounded-2xl scrollbar-thin scrollbar-thumb-gray-200">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-md">
        <img
          src={
            user?.profileImage ||
            "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          }
          alt="User Avatar"
          className="w-[100px] h-[100px] rounded-full object-cover mx-auto border-4 border-white-200 shadow-md relative top-[-0px]"
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-800 relative top-[-10px]">
          <Link to={`/profile/${user.id}`} style={{ width: "100px" }}>
            {user?.firstName} {user?.lastName || "Anonymous"}
          </Link>
        </h2>
        <p className="text-sm text-gray-500 relative top-[-10px]">
          {user?.email}
        </p>
        <div className="flex justify-center gap-6 my-3 text-sm text-gray-700">
          <div>
            <span className="font-bold relative top-[-10px]">
              {user?.followers?.length || 0}
            </span>
            <br />
            <span className="text-xs text-gray-400 relative top-[-10px]">
              Followers
            </span>
          </div>
          <div>
            <span className="font-bold relative top-[-10px]">
              {user?.following?.length || 0}
            </span>
            <br />
            <span className="text-xs text-gray-400 relative top-[-10px]">
              Following
            </span>
          </div>
        </div>
        <hr
          style={{ height: "3px", backgroundColor: "#333", border: "none" }}
        />
        <br />
        <h1 className="text-lg font-semi text-dark-500 mb-3">
          <b>Achivements</b>
          <br />
        </h1>
        <p />
        <div className="flex justify-center gap-4">
          {completeCourse.length > 0 ? (
            <>
              <div className="flex items-center justify-center flex-col">
                <img
                  src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Biginner_yaebnv.png"
                  alt="Beginner Badge"
                  className="w-[40px] h-[40px]"
                />
                <span>{badgeCount.Beginner}</span>
              </div>
              <div className="flex items-center justify-center flex-col">
                <img
                  src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808778/Intermediate_o3ba9y.png"
                  alt="Intermediate Badge"
                  className="w-[40px] h-[40px]"
                />
                <span>{badgeCount.Intermediate}</span>
              </div>
              <div className="flex items-center justify-center flex-col">
                <img
                  src="https://res.cloudinary.com/dgt4osgv8/image/upload/v1745808777/Advanced_x2xmg7.png"
                  alt="Advanced Badge"
                  className="w-[40px] h-[40px]"
                />
                <span>{badgeCount.Advanced}</span>
              </div>
            </>
          ) : (
            <div className="w-full h-32 bg-white-200 rounded-lg flex items-center justify-center">
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
        <h3 className="text-lg font-semi text-dark-500 mb-3">
          <b>Enrolled Courses ({enrollments.length})</b>
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
        </div><br/>
        <HashLink
          to={`/profile/${user.id}/#enrolled-courses`}
          className="text-blue-600 hover:underline text-sm font-semibold"
        >
          View All Courses
        </HashLink>
      </div>
    </div>
  );
};

export default UserInfoCard;
