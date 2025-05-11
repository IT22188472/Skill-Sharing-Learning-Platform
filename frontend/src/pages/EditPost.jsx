import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    imageFile: null,
    videoFile: null
  });
  const [currentMedia, setCurrentMedia] = useState({
    imageUrl: '',
    videoUrl: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        const post = response.data;
        
        // Check if user is the post owner
        if (user.id !== post.user.id) {
          navigate('/');
          return;
        }

        setFormData({
          title: post.title || '',
          ingredients: post.ingredients || '',
          instructions: post.instructions || '',
          imageFile: null,
          videoFile: null
        });
        
        setCurrentMedia({
          imageUrl: post.imageUrl || '',
          videoUrl: post.videoUrl || ''
        });

        setCurrentPost(post);
      } catch (error) {
        setError('Failed to fetch recipe');
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const postData = new FormData();
    
    // Always include these fields even if they haven't changed
    postData.append('id', postId); // Ensure we're updating the correct post ID
    postData.append('title', formData.title);
    postData.append('ingredients', formData.ingredients);
    postData.append('instructions', formData.instructions);
    
    if (formData.imageFile) {
      postData.append('imageFile', formData.imageFile);
    }
    if (formData.videoFile) {
      postData.append('videoFile', formData.videoFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${postId}`,
        postData,
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        // Navigate to the post detail page
        navigate(`/posts/${postId}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update recipe');
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview for image or video
      if (file) {
        if (name === 'imageFile') {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else if (name === 'videoFile') {
          const url = URL.createObjectURL(file);
          setVideoPreview(url);
        }
      } else {
        if (name === 'imageFile') {
          setImagePreview(null);
        } else if (name === 'videoFile') {
          setVideoPreview(null);
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.value
      }));
    }
  };

  if (!currentPost && !error) {
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

  return (
    <div className="bg-orange-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-8 md:py-10 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Your Recipe</h1>
            <p className="mt-2 text-orange-100">
              Update your recipe details and media
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Recipe Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md py-3"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                  Ingredients
                </label>
                <div className="mt-1">
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    required
                    rows="5"
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.ingredients}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  List each ingredient on a new line with measurements
                </p>
              </div>
              
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <div className="mt-1">
                  <textarea
                    id="instructions"
                    name="instructions"
                    required
                    rows="8"
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.instructions}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="mb-3">
                          <img 
                            src={imagePreview} 
                            alt="Recipe preview" 
                            className="mx-auto h-32 w-auto object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, imageFile: null }));
                            }}
                            className="mt-2 text-xs text-red-600 hover:text-red-800"
                          >
                            Remove new image
                          </button>
                        </div>
                      ) : currentMedia.imageUrl ? (
                        <div className="mb-3">
                          <img 
<<<<<<< HEAD
                            src={`http://localhost:8081${currentMedia.imageUrl}`} 
=======
                            src={`http://localhost:8080${currentMedia.imageUrl}`} 
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
                            alt="Current recipe" 
                            className="mx-auto h-32 w-auto object-cover rounded"
                          />
                          <p className="mt-2 text-xs text-gray-500">Current image</p>
                        </div>
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="imageFile"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                        >
                          <span>Upload a new image</span>
                          <input
                            id="imageFile"
                            name="imageFile"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Video (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {videoPreview ? (
                        <div className="mb-3">
                          <video 
                            src={videoPreview} 
                            controls 
                            className="mx-auto h-32 w-auto object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVideoPreview(null);
                              setFormData(prev => ({ ...prev, videoFile: null }));
                            }}
                            className="mt-2 text-xs text-red-600 hover:text-red-800"
                          >
                            Remove new video
                          </button>
                        </div>
                      ) : currentMedia.videoUrl ? (
                        <div className="mb-3">
                          <video 
<<<<<<< HEAD
                            src={`http://localhost:8081${currentMedia.videoUrl}`} 
=======
                            src={`http://localhost:8080${currentMedia.videoUrl}`} 
>>>>>>> e8cb9c1e (Follow/Unfollow User, Save/Unsave Post & Like/Unlike Post with correctly triggered Backend)
                            controls 
                            className="mx-auto h-32 w-auto object-cover rounded"
                          />
                          <p className="mt-2 text-xs text-gray-500">Current video</p>
                        </div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="videoFile"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                        >
                          <span>Upload a new video</span>
                          <input
                            id="videoFile"
                            name="videoFile"
                            type="file"
                            accept="video/*"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">MP4, MOV up to 50MB</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Link
                  to={`/posts/${postId}`}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
