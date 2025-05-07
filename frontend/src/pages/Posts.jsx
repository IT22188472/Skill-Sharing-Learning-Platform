import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts...');
      const response = await axios.get('http://localhost:8081/api/posts');
      setPosts(response.data);
      console.log('Fetched posts:', response.data.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    console.log(`Post deleted: ${postId}, refreshing posts list`);
    // Force a re-render by incrementing the refresh key
    setRefreshKey(key => key + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">All Recipes</h1>
        <p className="text-gray-600">Explore delicious recipes from our community</p>
      </div>

      {/* Create New Recipe Button */}
      <div className="mb-8 flex justify-end">
        <Link
          to="/createpost"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="h-full">
              <PostCard 
                post={post} 
                onPostDeleted={handlePostDeleted} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-xl">No recipes found.</p>
            <p className="text-gray-400 mt-2">Be the first to share a delicious recipe!</p>
            <Link
              to="/createpost"
              className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Create Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
