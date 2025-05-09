import React, { useState, useEffect } from "react";
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-yellow-50 shadow-md h-[70px]">
      <div className="w-full h-[10px] bg-orange-500" />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 relative">
          {/* Logo */}
          <Link to="/" className="relative top-[-15px] left-[220px]">
            <img
              src="/logo black.png"
              alt="Logo"
              className="w-[200px] h-[50px]"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 w-full justify-end">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-black font-bold text-xl hover:text-orange-400 font-poppins relative right-[420px] -top-[15px]"
                >
                  Recipes
                </Link>
                <Link
                  to={`/courses/${user.id}`}
                  className="text-black font-bold text-xl hover:text-orange-400 font-poppins relative right-[380px] -top-[15px]"
                >
                  Courses
                </Link>
                <Link
                  to="/groups"
                  className="text-black font-bold text-xl hover:text-orange-400 font-poppins relative right-[340px] -top-[15px]"
                >
                  Groups
                </Link>
                <Link
                  to="/my-recipes"
                  className="text-black font-bold text-xl hover:text-orange-400 font-poppins relative right-[300px] -top-[15px]"
                >
                  My Recipes
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="text-black font-bold text-xl hover:text-orange-400 font-poppins relative right-[260px] -top-[15px]"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-bold text-xl font-poppins relative right-[185px] -top-[15px]"
                >
                  Logout
                </button>

                <img
                  src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                  alt="User"
                  className="rounded-full object-cover w-[35px] h-[35px] relative right-[300px] -top-[13px]"
                />

                <div className="relative right-[200px] top-[-15px] w-[120px] h-[35px] flex items-center justify-center">
                  <span className="font-poppins font-bold text-xl">
                    {currentDateTime.toLocaleTimeString()}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-black hover:text-orange-600">
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
              className="text-black hover:text-orange-600 focus:outline-none"
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
                <div className="px-4 text-black font-medium">
                  Welcome, {user.firstName}
                </div>
                <Link
                  to="/"
                  className="block text-black hover:bg-orange-100 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recipes
                </Link>
                <Link
                  to={`/courses/${user.id}`}
                  className="block text-black hover:bg-orange-100 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/groups"
                  className="block text-black hover:bg-orange-100 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Groups
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="block text-black hover:bg-orange-100 px-4 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-recipes"
                  className="block text-black hover:bg-orange-100 px-4 py-2 rounded-md text-base font-medium"
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
                  className="block text-black hover:bg-orange-100 px-4 py-2 rounded-md text-base font-medium"
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
