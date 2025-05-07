import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        const response = await axios.get('http://localhost:8081/api/users/profile', {
          headers: {
            'Authorization': authToken
          }
        });

        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8081/auth/signin', {
        email,
        password
      });

      const { token, userId, firstName, lastName } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        
        // Set the user state with ID and other information
        setUser({
          id: userId,
          firstName,
          lastName,
          email
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
