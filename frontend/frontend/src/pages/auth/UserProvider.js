import Cookies from 'js-cookie'; // Import js-cookie to manage cookies
import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [token, setToken] = useState(null); // Store JWT token
  const [loading, setLoading] = useState(true); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [username, setUsername] = useState(null); // Store username

  // Check for a token in cookies on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedToken = Cookies.get('jwt'); // Try to get the token from cookies
      const savedUsername = Cookies.get('username'); // Fetch username if available

      if (savedToken) {
        setToken(savedToken);
        setIsAuthenticated(true);
        setUsername(savedUsername || null);
        // Optionally, fetch user data from the server if needed
      } else {
        setIsAuthenticated(false);
        setUsername(null);
        
      }

      setLoading(false); // Set loading to false after the check
    };

    checkAuthStatus();
  }, []);
  // Login function (also sets the cookie)
  const login = (userData, token) => {
    setUser (userData); // Set the user data
    setToken(token); // Set the token
    Cookies.set('jwt', token, { expires: 7 });
    setUsername(userData.username); // Set the username in state
    setIsAuthenticated(true)

  };

  // Logout function (also removes the cookie)
  const logout = () => {
    setUser(null); // Clear the user data
    setToken(null); // Clear the token
    Cookies.remove('jwt'); // Remove the token from cookies
    Cookies.remove('username');
    setUsername(null);
    // You can handle logout API call
    fetch("http://127.0.0.1:5000/auth/logout", {
      method: "POST",
    })
    .then(response => {
      if (response.ok) {
        console.log("Logged out successfully");
      } else {
        console.error("Failed to log out", response.status);
      }
    });
    setIsAuthenticated(false);
  };
  
  console.log(isAuthenticated)


  return (
    <UserContext.Provider value={{ user, token,username, login, logout, loading, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider; 