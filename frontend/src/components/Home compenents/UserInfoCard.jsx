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
    <div className="fixed top-[85px] left-[140px] w-[250px] h-[470px] overflow-y-auto space-y-4 z-50 pr-2 rounded-2xl scrollbar-thin scrollbar-thumb-gray-200">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-md">
        <img
          src={
            user?.backgroundImage ||
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=900&q=60"
          }
          alt="User Background"
          className="w-full h-[90px] rounded-t-2xl object-cover"
        />
        <img
          src={
            user?.profileImage ||
            "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          }
          alt="User Avatar"
          className="w-[100px] h-[100px] rounded-full object-cover mx-auto border-4 border-white-200 shadow-md relative -top-[70px]"
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-800 relative top-[-75px]">
          <Link to={`/profile/${user.id}`} style={{ width: "100px" }}>
            {user?.firstName} {user?.lastName || "Anonymous"}
          </Link>
        </h2>
        <p className="text-sm text-gray-500 relative top-[-70px]">
          {user?.email}
        </p>
        
        <br />
        <h1 className="text-lg font-semi text-dark-500 mb-3 text-left relative top-[-70px]">
          <b>&nbsp;&nbsp;&nbsp;&nbsp;Achivements</b>
          <br />
        </h1>
        <p />
        <div className="flex justify-center gap-4 relative top-[-70px]">
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
            <div className="w-full h-30 bg-white-200 rounded-lg flex items-center justify-center">
              <span className="text-dark-500 text-2xl font-semibold">
                &nbsp;&nbsp;&nbsp;&nbsp;No completed courses found
              </span>
            </div>
          )}
        </div><br/>
        <h3 className="text-lg font-semi text-dark-500 mb-3 text-left relative top-[-70px] h-[20px]">
          <b>&nbsp;Enrolled Courses ({enrollments.length})</b>
        </h3>
        <div className="grid grid-cols-4 gap-3 justify-center relative top-[-70px] h-[0px]">
          {enrollments.length > 0 ? (
            enrollments.map((enrollment, index) => (
              <div
                key={index}
                className="relative bg-gray-300 rounded-full overflow-hidden h-[50px]"
                style={{ width: "50px", height: "50px" }}
              >
                <Link
                  to={`/enrollments/${enrollment.courseId}/${user.id}`}
                  className="block w-full h-[10px]"
                >
                  <img
                    src={enrollment.image || "https://via.placeholder.com/90"}
                    alt="Enrollment"
                    className="w-full h-[50px] object-cover"
                  />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 h-8 bg-gray-200 rounded-lg flex items-center justify-center ">
              <span className="text-dark text-sm font-semibold">
                No enrollments found
              </span>
            </div>
          )}
        </div>
        <HashLink
          to={`/profile/${user.id}/#enrolled-courses`}
          className="text-blue-600 hover:underline text-sm font-semibold h-[0px] relative top-[0px]"
        >
          View All Courses
        </HashLink>
      </div>
    </div>
  );
};

export default UserInfoCard;
