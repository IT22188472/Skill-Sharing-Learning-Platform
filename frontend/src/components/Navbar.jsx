import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">FlavorFlow</Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <Link to="/create-post" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Create Post
              </Link>
              <Link to="/groups" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Groups
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-white">Welcome, {user.firstName}</span>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-white hover:text-gray-300 px-4 py-2"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
