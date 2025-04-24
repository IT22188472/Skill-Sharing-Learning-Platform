import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav2 from "../pages/nav_1";
import axios from "axios";
import Swal from "sweetalert2";

const CourseDetail = () => {
  const { userid, id } = useParams();
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
        const videoUrl = getYouTubeEmbedUrl(response.data.video[0]);
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
        if (iframeRef.current) {
          const iframeWindow = iframeRef.current.contentWindow;
          iframeWindow.postMessage(
            '{"event":"command","func":"stopVideo","args":""}',
            "*"
          );
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
      }, 20000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, [courseVideoUrl]);

  const enrollUser = async () => {
    try {
      const enrollmentData = {
        userId: userid,
        image: course.images[0] || "default-image-url", // fallback if images are missing
        name: course.name,
        courseId: id,
        enrollDate: new Date().toISOString(),
        description: course.description,
        duration: course.duration,
        level: course.level,
        ageRange: course.ageRange,
        video:
          course.video.length > 0 ? [course.video[0]] : ["default-video-url"], // fallback if video is missing
        skillsImprove:
          course.skillsImprove && course.skillsImprove.length > 0
            ? course.skillsImprove
            : ["default-skill"], // fallback if skillsImprove is missing
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
      await Swal.fire("Success!", "You have enrolled successfully!", "success");
      navigate(`/enrollments/${id}/${userid}`);
    } catch (error) {
      console.error("Enrollment failed:", error);
      Swal.fire("Oops!", "Failed to enroll.", "error");
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
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
      <Nav2 />
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={7}>
            <Card className="p-4 shadow-sm rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="Avatar"
                    className="rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "15px",
                    }}
                  />
                  <div>
                    <h2 className="text-xl fw-bold mb-0">{course.name}</h2>
                    <small className="text-lg text-muted">
                      by FlavorFlow · {new Date().toLocaleDateString()}
                    </small>
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
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted p-4">
                    No Video Available
                  </div>
                )}
              </div>

              {/* Display images for the course */}
              {course.images && course.images.length > 0 && (
                <div className="mb-3">
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
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}

              {/* Description */}
              <div className="mb-3">
                <p style={{ fontSize: "1rem", lineHeight: "1.6" }}>
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
              <div className="mb-3">
                {Array.isArray(course.skills) &&
                  course.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark me-2 mb-2 p-2 rounded-pill"
                    >
                      #{skill}
                    </span>
                  ))}
              </div>

              {/* Reactions */}
              <div className="d-flex justify-content-around border-top pt-3 mb-3">
                <Button variant="light">👍 120</Button>
                <Button variant="light">💬 45</Button>
                <Button variant="light">🔗 Share</Button>
              </div>

              {/* Comment Box */}
              <Form>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Write a comment..."
                    className="rounded-pill px-4 py-2"
                  />
                </Form.Group>
              </Form>

              {/* Small Course Info */}
              <div className="mt-4 p-3 bg-light rounded-4">
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
                    <strong>Skills:</strong> {course.skills?.join(", ")}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseDetail;
