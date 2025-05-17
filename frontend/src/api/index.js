import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

// Add a request interceptor to include JWT token in all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const createPost = (postData) => {
  return API.post('/api/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllPosts = () => API.get('/posts');
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const likePost = (postId) => API.put(`/posts/like/${postId}`);
export const savePost = (postId) => API.put(`/posts/save/${postId}`);
export const deletePost = (postId) => API.delete(`/posts/${postId}`);

export default API;
