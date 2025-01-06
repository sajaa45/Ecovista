import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

const Navbar = () => {
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
        <li><Link to="/contact">Contact</Link></li>
        <li ><Link to="/login" id="login" >Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
