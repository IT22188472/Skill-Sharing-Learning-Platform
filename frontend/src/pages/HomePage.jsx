import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
=======
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
<<<<<<< HEAD
  const [categories, setCategories] = useState(['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks']);
  const [activeCategory, setActiveCategory] = useState('All');
  const { user } = useAuth();
=======
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a

  useEffect(() => {
    const fetchPosts = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get('http://localhost:8080/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch recipes');
=======
        const response = await axios.get('http://localhost:8081/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

<<<<<<< HEAD
  // Filter posts by category (this is just a UI filter since we don't have actual categories in the backend yet)
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.title.toLowerCase().includes(activeCategory.toLowerCase()));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-orange-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-orange-200 rounded w-24 mb-2.5"></div>
          <div className="h-3 bg-orange-100 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 p-4 bg-red-50 text-red-600 rounded-lg max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">{error}</p>
        <p className="mt-2 text-sm">Please try again later or check your connection.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover & Share Amazing Recipes</h1>
              <p className="text-lg mb-6 text-orange-100">
                Join our community of food enthusiasts and explore delicious recipes from around the world.
              </p>
              {!user && (
                <div className="flex flex-wrap gap-4">
                  <Link to="/signup" className="bg-white text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md">
                    Join Now
                  </Link>
                  <Link to="/login" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 py-3 rounded-full font-medium transition duration-200">
                    Sign In
                  </Link>
                </div>
              )}
              {user && (
                <Link to="/create-post" className="bg-white text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md flex items-center w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Recipe
                </Link>
              )}
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Delicious Food" 
                className="rounded-lg shadow-2xl max-w-full h-auto object-cover max-h-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-orange-500 text-white font-medium shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          {activeCategory === 'All' ? 'Latest Recipes' : `${activeCategory} Recipes`}
          <span className="ml-2 bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {filteredPosts.length}
          </span>
        </h2>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any recipes in this category.</p>
            <button 
              onClick={() => setActiveCategory('All')} 
              className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-200"
            >
              View All Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Join Community Section */}
      {!user && (
        <div className="bg-white py-16 px-4 mt-12">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Join Our Culinary Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Share your favorite recipes, discover new dishes, and connect with food enthusiasts from around the world.
            </p>
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-full font-medium hover:from-orange-600 hover:to-red-700 transition duration-200 shadow-md inline-block"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      )}
=======
  if (loading) {
    return <div className="text-center mt-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Recent Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
    </div>
  );
};

export default HomePage;
