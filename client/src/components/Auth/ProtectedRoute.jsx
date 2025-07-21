import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!user || !token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // User's role is not authorized
    return <Navigate to="/404" replace />;
  }

  // Authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute; 