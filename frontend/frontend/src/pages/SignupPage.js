import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService"; // Assume you have a register function
import '../styles/App.css'; // Add this line to import your CSS file
import FacebookIcon from './facebook.png'; // Import the Facebook image
import GoogleIcon from './google.png';

function SignupPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await register(firstName, lastName, username, email, password); // Function in authService.js
            navigate("/home");
        } catch (err) {
            alert("Signup failed!");
        }
    };

    return (
        <div className="login-container">
            <h3 className="signup-header">Join us and explore the wonders<br/> of Tunisian nature with Ecovista</h3>
            <form onSubmit={handleSubmit} className="signup-form">
                <h1>Create an account!</h1>
                <div className="form-group">
                <div className="name-input">
                        <div style={{ flex: 1, marginRight: '10px' }}>
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                    </div></div>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <p>Already have an account? <a href="/login"><b>Login</b></a></p>
                <div className="button-container">
                    <button id="signup-button" type="submit">Sign Up</button>
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

export default SignupPage;