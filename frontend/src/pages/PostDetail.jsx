import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError('Failed to load recipe details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete a post');
        return;
      }
      
      // Make sure token is properly formatted with Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      await axios.delete(`http://localhost:8081/api/posts/${id}`, {
        headers: {
          'Authorization': authToken
        }
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete recipe. Please try again later.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Recipe not found'}</p>
          <Link to="/" className="underline mt-2 inline-block">Return to home</Link>
        </div>
      </div>
    );
  }
  
  // Check if the current user is the post owner
  const isOwner = user && post.user && user.id === post.user.id;
  
  // Parse ingredients into array
  const ingredientsList = post.ingredients?.split('\n').filter(item => item.trim()) || [];
  
  // Parse instructions into array
  const instructionsList = post.instructions?.split('\n').filter(item => item.trim()) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-orange-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to recipes
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {post.imageUrl ? (
              <img 
                src={`http://localhost:8081${post.imageUrl}`} 
                alt={post.title} 
                className="w-full h-[400px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <span>By {post.user?.firstName || 'Anonymous'}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            
            {post.videoUrl && (
              <div className="mt-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Video Recipe</h3>
                <video controls className="w-full rounded shadow">
                  <source src={`http://localhost:8081${post.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {isOwner && (
              <div className="flex space-x-3 mb-6">
                <Link 
                  to={`/posts/${post.id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex-1 text-center"
                >
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex-1"
                >
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="md:flex md:space-x-8">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Ingredients</h2>
              <ul className="list-disc pl-5 space-y-2">
                {ingredientsList.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Instructions</h2>
              <ol className="list-decimal pl-5 space-y-4">
                {instructionsList.map((instruction, index) => (
                  <li key={index} className="pl-2">{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
