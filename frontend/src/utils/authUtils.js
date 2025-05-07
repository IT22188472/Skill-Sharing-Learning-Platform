/**
 * Authentication utility functions
 */

// Save the token with a consistent key name
export const saveToken = (token) => {
  localStorage.setItem('jwt', token);
};

// Get the token from any possible storage location
export const getToken = () => {
  return localStorage.getItem('jwt') || 
         localStorage.getItem('token') || 
         localStorage.getItem('authToken') ||
         sessionStorage.getItem('jwt');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Clear authentication data
export const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('jwt');
};
