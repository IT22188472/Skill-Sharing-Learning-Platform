import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Welcome to FlavourFlow</h1>
          <p className="text-gray-600">Share your recipes and explore culinary creations!</p>
        </div>

        {user && (
          <div className="bg-orange-100 rounded-lg p-4 mb-8 text-center">
            <p className="text-orange-800 font-medium">Hello, {user.firstName || user.email}!</p>
            <Link 
              to="/create-post" 
              className="mt-2 inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Share Your Recipe
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {post.imageUrl && (
                  <img 
                    src={`http://localhost:8081${post.imageUrl}`} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2">
                    By {post.user?.firstName || 'Anonymous'} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <Link 
                    to={`/posts/${post.id}`}
                    className="text-orange-500 hover:text-orange-700"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No recipes found. Be the first to share your recipe!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
