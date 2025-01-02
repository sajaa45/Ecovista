import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import '../styles/App.css'; // Add this line to import your CSS file
import FacebookIcon from './facebook.png'; // Import the Facebook image
import GoogleIcon from './google.png';

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password); // Function in authService.js
            navigate("/home");
        } catch (err) {
            alert("Login failed!");
        }
    };

    return (
        <div className="login-container">
            <h3 className="login-header">Discover the secrets of the <br />  Tunisian nature with Ecovista</h3>
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Welcome back!</h1>
                <div className="form-group">
                    <label>E-mail adress</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <p>Dont  have and account? <a href="/sign-up"><b>Register</b></a></p>
                <div className="button-container">

                    <button id="login-button" type="submit">Login</button>
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
};

export default LoginPage;
