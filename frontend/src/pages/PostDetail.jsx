import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("instructions");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setError("Failed to load recipe details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete a post");
        return;
      }

      // Make sure token is properly formatted with Bearer prefix
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: {
          Authorization: authToken,
        },
      });

      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete recipe. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex justify-center items-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-pulse flex space-x-2 mb-4">
            <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
            <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
            <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-orange-800">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-orange-50 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recipe Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The recipe you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors duration-200"
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  // Check if the current user is the post owner
  const isOwner = user && post.user && user.id === post.user.id;

  // Parse ingredients into array
  const ingredientsList =
    post.ingredients?.split("\n").filter((item) => item.trim()) || [];

  // Parse instructions into array
  const instructionsList =
    post.instructions?.split("\n").filter((item) => item.trim()) || [];

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-12">
      {/* Hero Section with Image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
        {post.imageUrl ? (
          <img
            src={`http://localhost:8080${post.imageUrl}`}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600 opacity-90"></div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/"
            className="flex items-center text-white bg-black bg-opacity-30 hover:bg-opacity-50 px-4 py-2 rounded-full transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </div>

        {/* Title and info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black to-transparent">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-white text-opacity-90 mb-4 mt-2">
              <div className="flex items-center mr-6 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{post.user?.firstName || "Anonymous"}</span>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{ingredientsList.length} ingredients</span>
              </div>
            </div>

            {isOwner && (
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-full font-medium transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 -mt-10 relative z-10 -mt-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "instructions"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              Instructions
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "ingredients"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
            </button>
            {post.videoUrl && (
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "video"
                    ? "text-orange-600 border-b-2 border-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
                onClick={() => setActiveTab("video")}
              >
                Video
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === "instructions" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Instructions
                </h2>
                <ol className="space-y-6">
                  {instructionsList.map((instruction, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-600 font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="text-gray-700">{instruction}</div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Ingredients
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ingredientsList.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-center bg-orange-50 p-3 rounded-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "video" && post.videoUrl && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Video Recipe
                </h2>
                <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    poster={
                      post.imageUrl
                        ? `http://localhost:8080${post.imageUrl}`
                        : undefined
                    }
                  >
                    <source
                      src={`http://localhost:8080${post.videoUrl}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-gray-500 text-sm mt-3 text-center">
                  Watch the video tutorial to see how to prepare this recipe
                  step by step.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Share and Print Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-medium text-gray-800">
              Enjoy this recipe?
            </h3>
            <p className="text-gray-600">
              Share it with your friends and family!
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button className="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
