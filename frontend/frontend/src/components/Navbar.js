import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

const Navbar = ({refresh}) => {
  const [username, setUsername] = useState(Cookies.get("username"));

  useEffect(() => {
    // Update the username when `refresh` changes
    setUsername(Cookies.get("username"));
  }, [refresh]); // Dependency array includes refresh
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="\EcoVista__2_-removebg-preview.png" alt="Logo" />
      </div>
      <ul className="navbar-menu">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/destinations">Destinations</Link></li>
        <li><Link to="/activity">Activities</Link></li>
        <li><Link to="/travel-group">Travel Groups</Link></li>
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
