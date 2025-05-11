import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onPostDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if the current user is the post owner
  const isOwner = user && post.user && user.id === post.user.id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete a recipe');
        return;
      }
      
      // Make sure token is properly formatted with Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`, {
        headers: {
          'Authorization': authToken
        }
      });
      
      // Call the callback to update the UI
      if (onPostDeleted) {
        onPostDeleted(post.id);
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Error deleting post:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          setError('Access denied. You may not have permission to delete this recipe.');
        } else if (error.response.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError(error.response.data?.message || 'Error deleting recipe');
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Error deleting recipe: ' + error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleMedia = () => {
    setShowVideo(!showVideo);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!post) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col transform hover:-translate-y-1">
      {/* Media Container */}
      <div className="relative w-full h-56 bg-orange-100">
        {/* Loading skeleton */}
        {!isImageLoaded && post.imageUrl && !showVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-orange-200"></div>
          </div>
        )}

        {/* Show image or video based on state */}
        {post.imageUrl && post.videoUrl && (
          <>
            {showVideo ? (
              // Show video when showVideo is true
              <div className="relative w-full h-full">
                <video 
                  className="w-full h-full object-cover" 
                  controls
                >
<<<<<<< HEAD
                  <source src={`http://localhost:8081${post.videoUrl}`} type="video/mp4" />
=======
                  <source src={`http://localhost:8080${post.videoUrl}`} type="video/mp4" />
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
                  Your browser does not support the video tag.
                </video>
                <button 
                  onClick={toggleMedia}
                  className="absolute bottom-3 right-3 bg-white bg-opacity-90 text-orange-600 p-2 rounded-full shadow-md hover:bg-orange-100 transition duration-200"
                  aria-label="Show Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              // Show image when showVideo is false
              <div className="relative w-full h-full">
                <img
<<<<<<< HEAD
                  src={`http://localhost:8081${post.imageUrl}`}
=======
                  src={`http://localhost:8080${post.imageUrl}`}
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setIsImageLoaded(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80';
                    setIsImageLoaded(true);
                  }}
                />
                <button 
                  onClick={toggleMedia}
                  className="absolute bottom-3 right-3 bg-white bg-opacity-90 text-orange-600 p-2 rounded-full shadow-md hover:bg-orange-100 transition duration-200"
                  aria-label="Play Video"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Show only image if no video */}
        {post.imageUrl && !post.videoUrl && (
          <img
<<<<<<< HEAD
            src={`http://localhost:8081${post.imageUrl}`}
=======
            src={`http://localhost:8080${post.imageUrl}`}
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
            alt={post.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80';
              setIsImageLoaded(true);
            }}
          />
        )}

        {/* Show only video if no image */}
        {!post.imageUrl && post.videoUrl && (
          <video 
            className="w-full h-full object-cover" 
            controls
          >
<<<<<<< HEAD
            <source src={`http://localhost:8081${post.videoUrl}`} type="video/mp4" />
=======
            <source src={`http://localhost:8080${post.videoUrl}`} type="video/mp4" />
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
            Your browser does not support the video tag.
          </video>
        )}

        {/* Show placeholder if no media */}
        {!post.imageUrl && !post.videoUrl && (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        )}

        {/* Media type indicator badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {post.user && (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {post.user?.firstName || 'Anonymous'}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{post.title}</h2>
            {post.videoUrl && (
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Video
              </span>
            )}
          </div>
          
          <p className="text-gray-500 text-sm mb-3">
            {formatDate(post.createdAt)}
          </p>
          
          {/* Preview of ingredients */}
          {post.ingredients && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Ingredients:</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.ingredients.split('\n').slice(0, 2).join(', ')}
                {post.ingredients.split('\n').length > 2 ? '...' : ''}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-3 mt-4">
          <Link 
            to={`/posts/${post.id}`}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 w-full font-medium shadow-sm"
          >
            View Recipe
          </Link>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link 
                to={`/posts/${post.id}/edit`}
                className="bg-white border border-orange-500 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-50 text-sm flex-1 text-center transition duration-200"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-white border border-red-500 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 text-sm disabled:opacity-50 flex-1 transition duration-200"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
