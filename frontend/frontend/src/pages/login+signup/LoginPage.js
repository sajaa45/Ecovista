import Cookies from 'js-cookie';
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import { useRefresh } from '../auth/RefreshContext';
import { UserContext } from '../auth/UserProvider'; // Import the UserContext
function LoginPage() {
  const   {toggleRefresh}  = useRefresh();
  const { login, loading } = useContext(UserContext); // Destructure login function and authentication status from context
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      identifier: identifier.trim(),
      password: password.trim(),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_AUTH_API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the token and user data are returned in the response
        Cookies.set('jwt', data.token, { expires: 7 }); // Store the token in cookies for 7 days
        Cookies.set('username', data.username); // Store the username in cookies
        login(userData,data.token); // Call the login function from context to set user and token
        setError(''); // Clear error on success
        toggleRefresh();
        navigate(`/home`); // Redirect to home page
        
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred.");
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError("An error occurred while trying to log in.");
    }
  };

  return (
    <div className="login-container">
      <h3 className="login-header">Discover the secrets of the <br /> Tunisian nature with Ecovista</h3>
      <form onSubmit={handleLogin} className="login-form">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h1>Welcome back!</h1>
        <div className="form-group">
          <label>Email or Username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter email or username"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <p>Don't have an account? <a href="/sign-up"><b>Register</b></a></p>
        <div className="button-container">
          <button id="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default LoginPage;
