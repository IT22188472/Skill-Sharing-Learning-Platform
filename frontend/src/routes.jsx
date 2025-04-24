import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';

// Import components directly
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import Posts from './pages/Posts';

// For components that might not exist yet, use lazy loading with fallbacks
const Login = lazy(() => import('./pages/Login').catch(() => ({ default: () => <div>Login Page</div> })));
const Signup = lazy(() => import('./pages/Signup').catch(() => ({ default: () => <div>Signup Page</div> })));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts" element={<Posts />} />
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
