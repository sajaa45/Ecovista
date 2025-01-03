import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import FacebookIcon from './facebook.png';
import GoogleIcon from './google.png';

function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  
    const navigate = useNavigate(); 
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        const userData = {
          identifier: identifier,
          password: password
        };

        try {
          const response = await fetch('http://127.0.0.1:5000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          });

            if (response.ok) {
                const data = await response.json();
                // Handle successful login (e.g., store token, redirect, etc.)
                console.log(data["message"]);
                setError('');  // Clear error on success
                navigate('/home');
            } else {
                const errorData = await response.json();
                // Display error message if login fails
                setError(errorData.error || "An error occurred.");
            }
        } catch (err) {
            // Handle any errors that occur during fetch or connection
            console.error('Error during login:', err);
            setError("An error occurred while trying to log in.");
        }
    };

    return (
        <div className="login-container">
            <h3 className="login-header">Discover the secrets of the <br /> Tunisian nature with Ecovista</h3>
            <form onSubmit={handleLogin} className="login-form">
                {/* Display error message */}
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
                    <button id="login-button" type="submit" >
                        Login
                    </button>
                </div>
                <div className="oauth-container">
                     <button className="oauth-button facebook-button">
                    <img src={FacebookIcon} alt="Facebook" className="oauth-icon" />
                    </button>
                    <button className="oauth-button gmail-button">
                    <img src={GoogleIcon} alt="Google" className="oauth-icon" />
                    </button>
                    </div> 
            </form>
        </div>
    );
}

export default LoginPage;
