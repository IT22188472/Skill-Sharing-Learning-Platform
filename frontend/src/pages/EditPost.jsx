import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/posts/${postId}`);
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
        setError('Failed to fetch post');
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
        `http://localhost:8081/api/posts/${postId}`,
        postData,
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        // Force a full page refresh to show the updated post
        window.location.href = '/';
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post');
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.value
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Ingredients</label>
          <textarea
            name="ingredients"
            required
            rows="4"
            className="w-full p-2 border rounded"
            value={formData.ingredients}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Instructions</label>
          <textarea
            name="instructions"
            required
            rows="6"
            className="w-full p-2 border rounded"
            value={formData.instructions}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Image</label>
          {currentMedia.imageUrl && (
            <div className="mb-2">
              <img 
                src={`http://localhost:8081${currentMedia.imageUrl}`}
                alt="Current" 
                className="max-h-40 rounded"
              />
            </div>
          )}
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Video</label>
          {currentMedia.videoUrl && (
            <div className="mb-2">
              <video 
                src={`http://localhost:8081${currentMedia.videoUrl}`}
                controls
                className="max-h-40 rounded"
              />
            </div>
          )}
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded text-white font-medium ${
              isLoading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 py-2 px-4 rounded text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
