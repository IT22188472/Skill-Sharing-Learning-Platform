import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePostForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    imageFiles: [],
    videoFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        imageFiles: [e.target.files[0]]  // Store as array with single item
      });
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        videoFile: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to create a post');
      }

      const postFormData = new FormData();
      postFormData.append('title', formData.title);
      postFormData.append('ingredients', formData.ingredients);
      postFormData.append('instructions', formData.instructions);

      // Append image if exists
      if (formData.imageFiles.length > 0) {
        postFormData.append('imageFiles', formData.imageFiles[0]);
      }

      // Append video if exists
      if (formData.videoFile) {
        postFormData.append('videoFile', formData.videoFile);
      }

      const response = await axios.post(
        'http://localhost:8080/api/posts',
        postFormData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Handle successful response
      navigate('/posts/' + response.data.id);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Recipe</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <textarea
            className="form-control"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Enter each ingredient on a new line"
          />
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <textarea
            className="form-control"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Enter step by step instructions"
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input 
            type="file" 
            className="form-control" 
            accept="image/*" 
            onChange={(e) => handleImageChange(e)}
          />
          <small className="text-muted">Max file size: 10MB</small>
        </div>

        <div className="form-group">
          <label>Video (optional)</label>
          <input 
            type="file" 
            className="form-control" 
            accept="video/*" 
            onChange={(e) => handleVideoChange(e)}
          />
          <small className="text-muted">Max video length: 30 seconds (approx. 15MB)</small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-3" 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;
