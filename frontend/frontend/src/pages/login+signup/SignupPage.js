import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/App.css'; // Add this line to import your CSS file

function SignupPage() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_AUTH_API}/auth/sign-up`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({first_name, last_name, username, email, password})}); // Function in authService.js
                if (response.ok) {
                    const data = await response.json();
                    // Handle successful login (e.g., store token, redirect, etc.)
                    console.log(data["message"]);
                    setError('');
                    navigate('/home');}
                    else {
                        const errorData = await response.json();
                        // Display error message if login fails
                        setError(errorData.error || "An error occurred.");
                    }
                } catch (err) {
                    // Handle any errors that occur during fetch or connection
                    console.error('Error during signup:', err);
                    setError("An error occurred while trying to sign up.");
                }
    };

    return (
        <div className="login-container">
            <h3 className="signup-header">Join us and explore the wonders<br/> of Tunisian nature with Ecovista</h3>
            <form onSubmit={handleSubmit} className="signup-form">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h1>Create an account!</h1>
                <div className="form-group">
                <div className="name-input">
                        <div style={{ flex: 1, marginRight: '10px' }}>
                    <label>First Name</label>
                    <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} required/>
                </div>
                <div style={{ flex: 1 }}>
                    <label>Last Name</label>
                    <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} required/></div>
                    </div></div>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                </div>
                <p>Already have an account? <a href="/login"><b>Login</b></a></p>
                <div className="button-container">
                    <button id="signup-button" type="submit">Sign Up</button>
                </div>
                
            </form>
        </div>
    );
};

export default SignupPage;
