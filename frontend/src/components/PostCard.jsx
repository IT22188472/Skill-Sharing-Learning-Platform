import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaHeart,
  FaComment,
  FaShareAlt,
  FaBookmark,
} from "react-icons/fa";
import CommentsSection from "./CommentsSection";

const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.liked?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = user && post.user && user.id === post.user.id;

  useEffect(() => {
    if (user && post.liked) {
      const liked = post.liked.some(likedUser => likedUser.id === user.id);
      setIsLiked(liked);
    }
    // Initialize comments from post prop
    if (post.comments) {
      setComments(post.comments);
    }
  }, [user, post.liked, post.comments]);

  const getCommentCount = () => {
    return commentCount;
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    setIsDeleting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete a recipe");
        return;
      }
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, {
        headers: { Authorization: authToken },
      });
      onPostDeleted ? onPostDeleted(post.id) : navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setError(
            "Access denied. You may not have permission to delete this recipe."
          );
        } else if (error.response.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(error.response.data?.message || "Error deleting recipe");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Error deleting recipe: " + error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to like a post");
        return;
      }

      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      const response = await axios.put(
        `http://localhost:8080/api/posts/like/${post.id}`,
        {},
        {
          headers: { Authorization: authToken },
        }
      );

      setIsLiked(!isLiked);
      setLikeCount(response.data.liked.length);
      
      if (onPostUpdated) {
        onPostUpdated(response.data);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setError("Failed to like post. Please try again.");
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    setCommentCount(prev => prev + 1);
    if (onPostUpdated) {
      onPostUpdated({ ...post, comments: [...comments, newComment] });
    }
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(prev => prev.filter(comment => comment._id !== deletedCommentId));
    setCommentCount(prev => prev - 1);
    if (onPostUpdated) {
      onPostUpdated({ ...post, comments: comments.filter(c => c._id !== deletedCommentId) });
    }
  };

  const toggleMedia = () => setShowVideo(!showVideo);
  const handleBookmark = () => setIsBookmarked(!isBookmarked);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!post) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
      {/* Media Container */}
      <div className="relative w-full h-48 bg-orange-100">
        {!isImageLoaded && post.imageUrl && !showVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-orange-200"></div>
          </div>
        )}

        {post.imageUrl && post.videoUrl ? (
          showVideo ? (
            <div className="relative w-full h-full">
              <video className="w-full h-full object-cover" controls>
                <source
                  src={`http://localhost:8080${post.videoUrl}`}
                  type="video/mp4"
                />
              </video>
              <button
                onClick={toggleMedia}
                className="absolute bottom-3 right-3 bg-white bg-opacity-90 text-orange-600 p-2 rounded-full shadow-md hover:bg-orange-100 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={`http://localhost:8080${post.imageUrl}`}
                alt={post.title}
                className="w-full h-full object-cover"
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80";
                  setIsImageLoaded(true);
                }}
              />
              <button
                onClick={toggleMedia}
                className="absolute bottom-3 right-3 bg-white bg-opacity-90 text-orange-600 p-2 rounded-full shadow-md hover:bg-orange-100 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )
        ) : post.imageUrl ? (
          <img
            src={`http://localhost:8080${post.imageUrl}`}
            alt={post.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80";
              setIsImageLoaded(true);
            }}
          />
        ) : post.videoUrl ? (
          <video className="w-full h-full object-cover" controls>
            <source
              src={`http://localhost:8080${post.videoUrl}`}
              type="video/mp4"
            />
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3 flex space-x-2">
          {post.user && (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {post.user?.firstName || "Anonymous"}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div
        className="p-4 flex flex-col flex-grow"
        style={{ minHeight: "180px" }}
      >
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">
            {post.title}
          </h2>
          <p className="text-gray-500 text-xs ml-2 whitespace-nowrap">
            {formatDate(post.createdAt)}
          </p>
        </div>

        {post.ingredients && (
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-gray-700 mb-1">
              Ingredients:
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {post.ingredients.split("\n").slice(0, 2).join(", ")}
              {post.ingredients.split("\n").length > 2 ? "..." : ""}
            </p>
          </div>
        )}

        {/* Buttons Container */}
        <div className="mt-auto">
          {/* Owner Actions - First Line */}
          {isOwner && (
            <div className="flex justify-end space-x-3 mb-2 pb-2 border-b border-gray-100">
              <Link
                to={`/posts/${post.id}`}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <FaEye size={14} title="View" />
              </Link>
              <Link
                to={`/posts/${post.id}/edit`}
                className="text-green-600 hover:text-green-800 transition"
              >
                <FaEdit size={14} title="Edit" />
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 transition"
              >
                <FaTrash size={14} title="Delete" />
              </button>
            </div>
          )}

          {/* Social Media Buttons - Second Line */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition text-sm ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <FaHeart className={isLiked ? "fill-current" : ""} size={14} />
                <span>{likeCount}</span>
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center space-x-1 text-sm ${
                  showComments ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
                } transition`}
              >
                <FaComment size={14} />
                <span>{getCommentCount()}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition text-sm">
                <FaShareAlt size={14} />
              </button>
            </div>

            <button
              onClick={handleBookmark}
              className="text-gray-500 hover:text-yellow-500 transition"
            >
              <FaBookmark
                size={14}
                className={isBookmarked ? "text-yellow-500 fill-current" : ""}
              />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="border-t mt-3 pt-3">
            <div className="max-h-64 overflow-y-auto pr-2">
              <CommentsSection 
                postId={post.id} 
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;