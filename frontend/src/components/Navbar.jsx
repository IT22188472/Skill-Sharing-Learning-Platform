import React, { useState, useEffect } from "react"; // Add useEffect import
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-yellow-50 shadow-md"
      style={{ height: "70px" }}
    >
      <div
        style={{ width: "100%", height: "10px", backgroundColor: "orange" }}
      ></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            &nbsp; &nbsp; &nbsp; &nbsp;
            <img
              src="/logo black.png"
              alt="Logo"
              style={{
                width: "200px",
                height: "50px",
                position: "absolute",
                top: "15px",
                left: "220px",
              }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-black font-bold text-xl hover:text-orange-100 font-poppins"
                  style={{ position: "relative", right: "420px", top: "-5px" }}
                >
                  Recipes
                </Link>
                <Link
                  to={`/courses/${user.id}`}
                  className="text-black font-bold text-xl hover:text-orange-100 font-poppins"
                  style={{ position: "relative", right: "380px", top: "-5px" }}
                >
                  Courses
                </Link>
                <Link
                  to="/groups"
                  className="text-black font-bold text-xl hover:text-orange-100 font-poppins"
                  style={{ position: "relative", right: "340px", top: "-5px" }}
                >
                  Groups
                </Link>
                <Link
                  to="/my-recipes"
                  className="text-black font-bold text-xl hover:text-orange-100 font-poppins"
                  style={{ position: "relative", right: "300px", top: "-5px" }}
                >
                  My Recipes
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="text-black font-bold text-xl hover:text-orange-100 font-poppins"
                  style={{ position: "relative", right: "260px", top: "-5px" }}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-poppins font-bold text-xl"
                  style={{ position: "relative", right: "185px", top: "-5px" }}
                >
                  Logout
                </button>
                <img
                  src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                  alt="User"
                  className="rounded-full object-cover"
                  style={{
                    position: "relative",
                    right: "300px",
                    width: "35px",
                    height: "35px",
                    top: "-3px",
                  }}
                />
                <div style={{
                    position: "relative",
                    right: "200px",
                    width: "120px",
                    height: "35px",
                    top: "2px",
                  }}>
                  <span className="font-poppins font-bold text-xl">
                    {currentDateTime.toLocaleTimeString()}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-orange-100">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-full font-medium transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-orange-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-orange-400">
            {user ? (
              <div className="flex flex-col space-y-2 pb-3">
                <div className="px-4 text-white font-medium">
                  Welcome, {user.firstName}
                </div>
                <Link
                  to="/"
                  className="block text-white hover:bg-orange-600 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recipes
                </Link>
                <Link
                  to={`/courses/${user.id}`}
                  className="block text-white hover:bg-orange-600 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/groups"
                  className="block text-white hover:bg-orange-600 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Groups
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="block text-white hover:bg-orange-600 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-recipes"
                  className="block text-white hover:bg-orange-600 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Recipes
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pb-3">
                <Link
                  to="/login"
                  className="block text-white hover:bg-orange-600 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-white text-orange-600 px-4 py-2 rounded-md text-base font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
