import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CourseCard = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:8080/courses/active")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="fixed flex flex-col gap-6 items-center py-8">
      {/* Main Card Container */}
      <div className="flex flex-col items-center bg-white border border-gray-200 w-[280px] relative top-[-953px] left-[1190px]">
        <h2 className="text-2xl font-bold text-gray-500 mt-2 mb-2">
          Available Courses ({courses?.length})
        </h2>

        {/* Scrollable Container for Courses */}
        <div className="overflow-y-auto max-h-[580px] w-full relative left-[7px]">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.courseId}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 h-[90px] mb-2 w-[250px]"
              >
                &nbsp;&nbsp;&nbsp;
                <img
                  className="object-cover w-[100px] rounded-xl h-24"
                  src={
                    course.images && course.images.length > 0
                      ? course.images[0]
                      : "https://img.freepik.com/free-psd/delicious-spaghetti-dish-with-fresh-ingredients-pan-with-transparent-background_84443-25952.jpg?semt=ais_hybrid&w=740"
                  }
                  alt={course.name}
                />
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-black relative top-[-5px]">
                    {course.name}
                  </h5>
                  <span>
                    🎬 -
                    <span>
                      <b>&nbsp;{course.video?.length || 0}</b>
                    </span>
                    &nbsp;&nbsp;&nbsp;
                    <span>
                      📷 -
                      <span>
                        <b>&nbsp;{course.images?.length || 0}</b>
                      </span>
                    </span>
                  </span>

                  <Link
                    to={`/course/${course.courseId}/${user.id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-center mt-2 py-1 px-2 rounded-lg text-sm font-semibold w-fit"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-full">No courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
