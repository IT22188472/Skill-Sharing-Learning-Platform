import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Enrollments = () => {
  const { courseId, userId } = useParams();
  const [enroll, setEnroll] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [duration, setDuration] = useState(1); // prevent divide by 0
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const lastValidTimeRef = useRef(0);

  const fetchEnrollment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/enrollments/${courseId}/${userId}`
      );
      setEnroll(response.data[0]);
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      setError("Failed to fetch enrollment.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [courseId, userId]);

  useEffect(() => {
    if (playerRef.current) {
      const videoDuration = playerRef.current.duration;
      setDuration(videoDuration); // Update the video duration
    }
  }, [enroll]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.currentTime;
          setWatchedSeconds(currentTime);
        }
      }, 1000); // Update progress every second
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);

  const onTimeUpdate = (event) => {
    const currentTime = event.target.currentTime;
    setWatchedSeconds(currentTime); // Update watched seconds based on video progress
  };

  const onSeeked = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      setWatchedSeconds(currentTime); // Update watched seconds when the user seeks
    }
  };

  const actualProgress = Math.min((watchedSeconds / duration) * 100, 100);

  const isCompleteable =
    actualProgress >= 95 && watchedSeconds >= duration * 0.95;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-4 mb-4">
          <div
            className="bg-gray-200 p-4 rounded-5 shadow-sm"
            style={{
              width: "50%",
              minHeight: "380px",
              position: "relative",
              top: "50px",
              left: "50px",
            }}
          >
            <h2 className="fw-bold mb-3 text-center text-3xl">Profile</h2>
            <div className="text-center">
              <img
                src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                alt="User"
                className="rounded-circle shadow-sm mb-3"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <Link to={`/profile/${userId}`}>
                <h5 className="text-xl font-bold">
                  {enroll?.user?.firstName} {enroll?.user?.lastName}
                </h5>
              </Link>
              <br />
            </div>
            <hr />
            <div className="d-grid gap-3">
              <Link to="/enroll-courses" className="btn btn-outline-primary">
                Enrolled Courses
              </Link>
              <Link to="/progress" className="btn btn-outline-secondary">
                Progress
              </Link>
              <Link to="/achievements" className="btn btn-outline-success">
                Achievements
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-8 mb-4">
          <div
            className="bg-gray-200 p-4 rounded-5 shadow-sm"
            style={{
              width: "115%",
              maxWidth: "1150px",
              margin: "0 auto",
              position: "relative",
              left: "-200px",
              top: "0px",
            }}
          >
            <h2 className="mb-3 text-4xl">
              <b>
                {enroll.courseId}&nbsp;-&nbsp;{enroll.name}
              </b>
            </h2>
            <h2
              className="text-xl"
              style={{ position: "absolute", top: "30px", left: "620px" }}
            >
              <strong>Enrollment Date:</strong>{" "}
              {new Date(enroll.enrollDate).toLocaleDateString()}
            </h2>

            {/* Cloudinary Video */}
            <video
              ref={playerRef}
              controls={!isCompleteable} // Disable controls if not completeable
              onPlay={onPlay}
              onPause={onPause}
              onTimeUpdate={onTimeUpdate}
              onSeeked={onSeeked} // Listen for video seeking
              style={{ width: "800px", height: "450px" }}
            >
              <source src={enroll.video[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Progress Bar */}
            <div className="mt-3">
              <label>
                <strong>Watched Progress</strong>
              </label>
              <div
                className="progress"
                style={{ height: "20px", width: "600px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${actualProgress}%` }}
                  aria-valuenow={actualProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {Math.floor(actualProgress)}%
                </div>
              </div>
            </div>
            <div className="text-lg"
              style={{
                width: "800px",
                height: "30px",
                position: "absolute",
                color: "red",
                top: "480px",
                backgroundColor: "lightgray",
                display: "flex",
                alignItems: "center", 
                justifyContent: "center", 
              }}
            >
              <strong>Note : &nbsp;</strong> Complete Button is disabled for this video
              until 95% of the content is watched.
            </div>

            {/* Completion Button */}
            {isCompleteable && (
              <div
                className="mt-4 text-center"
                style={{ position: "absolute", top: "515px", left: "630px" }}
              >
                <button className="btn btn-success btn-lg w-60 text-lg">
                  ✅ Complete This Course
                </button>
              </div>
            )}

            {/* Course Images */}
            <div
              className="mt-4"
              style={{ position: "absolute", top: "20px", left: "850px" }}
            >
              {enroll.images && enroll.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xl font-semibold mb-3">Course Images</h4>
                  {enroll.images.map((image, idx) => (
                    <div key={idx} className="mb-4">
                      <img
                        src={image}
                        alt={`Course Image ${idx + 1}`}
                        className="rounded-lg shadow-md"
                        style={{
                          width: "90%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Description */}
            <br />
            <div style={{ width: "760px", textAlign: "justify" }}>
              <p className="text-xl">
                <strong>Description:</strong>
                <br /> &nbsp;&nbsp;&nbsp;&nbsp;{enroll.description}
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollments;
