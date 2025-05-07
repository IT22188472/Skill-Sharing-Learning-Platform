import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    imageFile: null,
    videoFile: null
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const postData = new FormData();
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
      await axios.post('http://localhost:8081/api/posts', postData, {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
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
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
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
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Video (optional)</label>
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
