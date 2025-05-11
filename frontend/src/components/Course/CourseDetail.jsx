import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UserInfoCard3 from "../Course/UserInfoCard3";
import CourseCard from "./CourseCard";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from "/logo black.png";

const CourseDetail = () => {
  const { user } = useAuth();
  const { userid, id } = useParams();
  const courseId = id;
  const userId = userid;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [courseVideoUrl, setCourseVideoUrl] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/courses/${id}`);
        setCourse(response.data);
        const videoUrl = getVideoUrl(response.data.video[0]);
        setCourseVideoUrl(videoUrl);
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (courseVideoUrl) {
      const timer = setTimeout(() => {
        if (
          courseVideoUrl.includes("youtube.com") ||
          courseVideoUrl.includes("youtu.be")
        ) {
          // YouTube Video - Stop video after 20 seconds
          if (iframeRef.current) {
            const iframeWindow = iframeRef.current.contentWindow;
            iframeWindow.postMessage(
              '{"event":"command","func":"stopVideo","args":""}',
              "*"
            );
          }
        } else {
          // Non-YouTube Video - Pause the video after 20 seconds (for Cloudinary MP4, etc.)
          const videoElement = document.querySelector("video");
          if (videoElement) {
            videoElement.pause(); // Pause the video
          }
        }

        Swal.fire({
          title: "Enjoying the course?",
          text: "Want to continue learning?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Enroll Now",
          cancelButtonText: "Maybe Later",
        }).then((result) => {
          if (result.isConfirmed) {
            enrollUser();
          }
        });
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [courseVideoUrl]);

  const enrollUser = async () => {
    try {
      const enrollmentData = {
        userId: userid,
        image: course.images[0] || "default-image-url",
        name: course.name,
        courseId: id,
        enrollDate: new Date().toISOString(),
        description: course.description,
        duration: course.duration,
        level: course.level,
        ageRange: course.ageRange,
        video:
          course.video.length > 0 ? [course.video[0]] : ["default-video-url"],
        skillsImprove:
          course.skillsImprove && course.skillsImprove.length > 0
            ? course.skillsImprove
            : ["default-skill"],
        images:
          course.images.length > 0 ? course.images : ["default-image-url"],
      };

      await axios.post(
        "http://localhost:8080/enrollments/enroll",
        enrollmentData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Show second SweetAlert after successful enrollment
      const result = await Swal.fire({
        title: "Enrolled Successfully!",
        text: "What do you want to do next?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Done this course now",
        cancelButtonText: "Explore courses",
      });

      if (result.isConfirmed) {
        navigate(`/enrollments/${courseId}/${userId}`);
      } else {
        navigate(`/courses/${userId}`);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
      Swal.fire("Oops!", "Failed to enroll.", "error");
    }
  };

  const getVideoUrl = (url) => {
    if (!url) return null;

    // Check if the URL is a Cloudinary MP4 URL
    if (url.includes("cloudinary.com") && url.endsWith(".mp4")) {
      return url;
    }

    // Otherwise, treat as YouTube video URL
    let videoId = "";
    if (url.includes("watch?v=")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1];
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`
      : null;
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;
  if (!course) return <div className="text-center py-5">No course found.</div>;

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>
      <br /> <br />
      <br /> <br />
      <Container className="py-4">
        <Row className="justify-content-center relative left-[-15px]">
          <Col md={7}>
            <Card className="p-4 shadow-sm rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3 ">
                <div className="d-flex align-items-center relative top-[-5px]">
                  &nbsp;&nbsp;&nbsp;<img
                    src={Logo}
                    alt="Avatar"
                    style={{
                      width: "140px",
                      height: "40px",
                      marginRight: "15px",
                    }}
                  />
                  <div>
                    <h2 className="text-2xl fw-bold mb-0 text-orange-300">  {course.name}</h2>
                  </div>
                </div>
                <Button
                  variant="outline-primary"
                  className="my-2 rounded-5 px-3 py-2"
                  onClick={enrollUser}
                >
                  <b>Enroll in Course</b>
                </Button>
              </div>

              {/* Video */}
              <div
                className="rounded-4 overflow-hidden mb-3"
                style={{ backgroundColor: "#000" }}
              >
                {courseVideoUrl ? (
                  courseVideoUrl.includes("youtube.com") ? (
                    <div style={{ position: "relative", paddingTop: "56.25%" }}>
                      <iframe
                        ref={iframeRef}
                        src={courseVideoUrl}
                        title="Course Video"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </div>
                  ) : (
                    <video
                      controls
                      autoPlay
                      muted
                      style={{
                        width: "100%",
                        height: "450px",
                      }}
                    >
                      <source src={courseVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="text-center text-muted p-4">
                    No Video Available
                  </div>
                )}
              </div>

              {/* Display images for the course */}
              {course.images && course.images.length > 0 && (
                <div className="mb-3 relative">
                  <Row>
                    {course.images.map((image, idx) => {
                      let colSize = 12;
                      if (course.images.length === 2) colSize = 6;
                      if (course.images.length === 3) colSize = 4;
                      if (course.images.length > 3) colSize = 6;

                      return (
                        <Col key={idx} xs={colSize} className="mb-3">
                          <img
                            src={image}
                            alt={`Course Image ${idx + 1}`}
                            className="w-100 rounded-4"
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}

              {/* Description */}
              <div className="mb-3 relative left-[10px]">
                <p className="text-lg" style={{ lineHeight: "1.6" }}>
                  {showFullDescription
                    ? course.description
                    : course.description.substring(0, 200) +
                      (course.description.length > 200 ? "..." : "")}
                </p>
                {course.description.length > 200 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show Less" : "Show More"}
                  </Button>
                )}
              </div>

              {/* Skills Hashtags */}
              <div className="mb-3 text-lg">
                {Array.isArray(course.skillsImprove) &&
                  course.skillsImprove.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark me-2 mb-2 p-2 rounded-pill"
                    >
                      #{skill.trim()}
                    </span>
                  ))}
              </div>

              {/* Small Course Info */}
              <div className="mt-4 p-3 bg-light rounded-4 relative top-[-20px]">
                <Row>
                  <Col xs={6}>
                    <strong>Duration:</strong> {course.duration} hrs
                  </Col>
                  <Col xs={6}>
                    <strong>Level:</strong> {course.level}
                  </Col>
                  <Col xs={6}>
                    <strong>Age Range:</strong> {course.ageRange}
                  </Col>
                  <Col xs={6}>
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(course.skillsImprove)
                      ? course.skillsImprove.join(", ")
                      : "N/A"}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <UserInfoCard3 user={user} />
      <CourseCard userid={userid}/>
      <Link
        to={`/courses/${userid}`}
        className="fixed top-[90px] left-[50px] w-[150px] mb-3 ms-2"
      >
        <div className="inline-flex items-center justify-center w-full px-4 py-2 border-2 border-gray-700 text-black text-sm font-semibold rounded-full hover:bg-gray-100 transition duration-300 ease-in-out">
          <svg
            className="w-5 h-5 mr-2 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H18a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Courses
        </div>
      </Link>
    </div>
  );
};

export default CourseDetail;
