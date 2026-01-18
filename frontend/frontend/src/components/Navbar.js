import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../pages/auth/UserProvider';

const Navbar = () => {
  const { username } = useContext(UserContext);

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
