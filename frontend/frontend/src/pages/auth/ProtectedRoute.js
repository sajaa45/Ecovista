import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserContext);

  // Show a loading spinner or message while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;