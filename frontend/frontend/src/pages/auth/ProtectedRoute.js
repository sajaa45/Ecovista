import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { RefreshContext } from './RefreshContext';

import { UserContext } from './UserProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserContext);
  const {  toggleRefresh  } = useContext(RefreshContext); // Consume setRefresh from context
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Trigger the refresh state whenever the route changes
    toggleRefresh()
  }, [location,toggleRefresh]); // This will trigger refresh when location changes

  // Show a loading spinner or message while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
