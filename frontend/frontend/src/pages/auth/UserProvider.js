import Cookies from 'js-cookie'; // Import js-cookie to manage cookies
import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  
  // Check for a token in cookies on initial load
  useEffect(() => {
    
    const fetchUser = async () => {
                const token = Cookies.get('jwt');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    
                }
    const savedToken = token; // Try to get the token from cookies
    if (savedToken) {
      setToken(savedToken);
      // Optionally, you can fetch user data here if needed
    }
    console.log(savedToken)
    setLoading(false); // Set loading to false after checking
  }; fetchUser();}, []);

  // Login function (also sets the cookie)
  const login = (userData, token) => {
    setUser (userData); // Set the user data
    setToken(token); // Set the token
    Cookies.set('token', token, { expires: 7 }); // Store token in cookie, expires in 7 days
    setIsAuthenticated(true)

  };

  // Logout function (also removes the cookie)
  const logout = () => {
    setUser (null); // Clear the user data
    setToken(null); // Clear the token
    Cookies.remove('token'); // Remove the token from cookies
    Cookies.remove('username'); // Remove the token from cookies

    const response = fetch("http://127.0.0.1:5000/auth/logout", {
      method: "POST", // Specify the HTTP method

    });    
    if (response.ok) {
      console.log("Logged out successfully");
      } else {
        console.log("Failed to log out", response.status);
        }
    setIsAuthenticated(false)
  };



  return (
    <UserContext.Provider value={{ user, token, login, logout, loading, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider; 