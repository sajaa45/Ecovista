import Cookies from 'js-cookie';
import { default as React, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import { useRefresh } from '../auth/RefreshContext';
import { UserContext } from '../auth/UserProvider';
import UpdateProfile from './UpdateProfile'; // Import the UpdateProfile component

const UserItem = () => {
    const { toggleRefresh } = useRefresh();
    const { logout } = useContext(UserContext);
    const { username } = useParams();
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // State to manage update form visibility
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    
    // Fetch user details
    useEffect(() => {
        const fetchUser  = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/login');  // Redirect to login if no token
                return;
            }
            console.log(token)
            try {
                const response = await fetch(`http://127.0.0.1:5000/users/${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to headers
                        'Content-Type': 'application/json',
                    },
                });

                // Handle unauthorized response
                if (response.status === 401) {
                    console.error('Unauthorized. Token might be invalid or expired.');
                    navigate('/login'); // Redirect to login on unauthorized
                    return;
                }

                const data = await response.json();
                setUser (data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser ();
    }, [username, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!user) {
        navigate('/login');
        return <p>No user found</p>;
    }

    const isAdminOrCurrentUser  = user.username?.toLowerCase() === username?.toLowerCase() || user.role === 'admin';

    const handleUpdateSuccess = (updatedUser ) => {
        setUser (updatedUser ); // Update the user state with the new data
        setIsUpdating(false); // Close the update form
        setSuccessMessage('Profile updated successfully!');
    };

    return (
        <div className="Destinationpage">
            <section className="destination-item">
                {isUpdating ? (
                    // Render the UpdateProfile component when updating
                    <UpdateProfile 
                        user={user} 
                        onUpdateSuccess={handleUpdateSuccess} 
                        onCancel={() => setIsUpdating(false)} 
                    />
                ) : (
                    // Render user details when not updating
                    <div className="destination-details">
                        <div className="destt_img">
                            {user.image_url ? (
                                <img src={user.image_url} alt="User  profile" />
                            ) : (
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/004/141/669/large_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                                    alt="Placeholder"
                                />
                            )}
                        </div>

                        <div className="destt_info">
                        {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>} {/* Display success message */}
                            <h1><strong>{user.first_name.toUpperCase()} {user.last_name.toUpperCase()}</strong></h1>
                            <p><strong>Created at:</strong> {new Date(user.created_at).toLocaleString()}</p>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                            {isAdminOrCurrentUser  && (
                                <>
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                </>
                            )}
                            
                            <button className="cta-button" onClick={() => setIsUpdating(true)}>Update</button>
                        </div>
                    </div>
                )}

                <div className='logout'>
                    <button
                        className="cta-button"
                        onClick={(e) => {
                            e.preventDefault();
                            logout(); // Directly call logout
                            navigate('/login'); // Redirect to login page
                            toggleRefresh();
                        }}
                    >
                        Logout
                    </button>
                </div>
            </section>
        </div>
    );
};

export default UserItem;