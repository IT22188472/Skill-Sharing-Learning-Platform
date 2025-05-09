import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserInfoCard from "../components/UserInfoCard";
import Topbar from "../components/Topbar";
import AllGroups from "../components/AllGroups";


const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories] = useState([
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snacks",
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch recipes");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) =>
          post.title.toLowerCase().includes(activeCategory.toLowerCase())
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
          <div className="h-3 bg-gray-100 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 p-4 bg-red-50 text-red-600 rounded-lg max-w-md mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mx-auto mb-3 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium">{error}</p>
        <p className="mt-2 text-sm">
          Please try again later or check your connection.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('https://your-image-url.com/your-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "gray",
      }}
    >
      <Topbar/>
      {/* Hero Section */}
      <div
        className="relative text-white py-40 px-4 bg-cover bg-center rounded-3xl"
        style={{
          backgroundImage: "url('/Landing5.jpg')",
          width: "660px",
          left: "440px",
          top: "95px",
          height: "300px",
        }}
      >
        <div
          className="bg-black bg-opacity-50 p-8 rounded-lg max-w-4xl mx-auto text-center top-[-10px]"
          style={{ position: "relative", left: "-0px", top: "-75px" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover & Share Amazing Recipes
          </h1>
          <p className="text-lg mb-6 text-gray-100">
            Join our community of food enthusiasts and explore delicious recipes
            from around the world.
          </p>
          {!user ? (
            <div className="flex justify-center flex-wrap gap-4">
              <Link
                to="/signup"
                className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md"
              >
                Join Now
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-full font-medium transition duration-200"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/create-post"
              className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create Recipe
            </Link>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div
        className="flex flex-wrap justify-center mt-10 mb-6 px-4 gap-2"
        style={{ position: "absolute", left: "425px", top: "430px" }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition duration-200 ${
              activeCategory === category
                ? "bg-orange-400 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {user && (
            <div className="lg:w-1/4 w-full">
              <UserInfoCard user={user} />
              <AllGroups user={user}/>
            </div>
          )}

          <div
            className="flex-1"
            style={{ position: "absolute", left: "450px", top: "500px" }}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
              {activeCategory === "All"
                ? "Latest Recipes"
                : `${activeCategory} Recipes`}
              <span className="ml-2 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredPosts.length}
              </span>
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                {/* ...empty state SVG and message... */}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} style={{ width: "650px", height: "400px"
                   }}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
