import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Enrollments = () => {
  const { courseId, userId } = useParams();  // Extract courseId and userId from URL
  const [enroll, setEnroll] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  // Fetching enrollment data
  const fetchEnrollment = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/enrollments/${courseId}/${userId}`);
      setEnroll(response.data[0]); // Since response is an array, set the first object
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      setError("Failed to fetch enrollment.");
    } finally {
      setIsLoading(false);  // Set loading to false once the request is done
    }
  };

  useEffect(() => {
    fetchEnrollment();  // Fetch enrollment data when component mounts or params change
  }, [courseId, userId]);  // Use courseId and userid as dependencies

  // Render loading, error, or enrollment details
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{enroll.name}</h1>
      <p>
        Enrolled by: {enroll.user.firstName} {enroll.user.lastName}
      </p>
      <p>Enrollment Date: {new Date(enroll.enrollDate).toLocaleDateString()}</p>
      <img
        src={enroll.image}
        alt={enroll.name}
        style={{ width: "200px", height: "auto", borderRadius: "8px" }}
      />
      <p>User Email: {enroll.user.email}</p>
    </div>
  );
};

export default Enrollments;
