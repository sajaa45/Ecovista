import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRefresh } from '../pages/auth/RefreshContext'; // Use the hook here

const Navbar = () => {
  const [username, setUsername] = useState(Cookies.get('username')); // Get the username from cookies on initial load
  const { refresh } = useRefresh(); // Consume the refresh state

  useEffect(() => {
    // Set the username again if it changes (e.g., after logout)
    setUsername(Cookies.get('username'));
  }, [refresh]); // Run this effect when the 'refresh' state changes
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <img src="/EcoVista__2_-removebg-preview.png" alt="Logo" />

      </div>
      <ul className="navbar-menu">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/destinations">Destinations</Link></li>
        <li><Link to="/activities">Activities</Link></li>
        <li><Link to="/travel-groups">Travel Groups</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
        {username ? ( // If user is authenticated
          <>
            <li><Link to={`/users/${username}`} id="login">Profile</Link></li>
          </>
        ) : (
          <li><Link to="/login" id="login">Login</Link>
                        </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
