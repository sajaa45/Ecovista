import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
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
    const [isDeleting, setIsDeleting] = useState(false); // State to handle delete confirmation
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
                const response = await fetch(`${process.env.REACT_APP_USER_API}/users/${username}`, {
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
                setUser(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username, navigate]);

    const handleDelete = async () => {
        const token = Cookies.get('jwt');
        if (!token) {
            navigate('/login');
            return;
        }

        const confirmation = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        if (!confirmation) return;

        setIsDeleting(true); // Start the deletion process

        try {
            const response = await fetch(`${process.env.REACT_APP_ACTIVITY_API}/users/${user.username}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Profile deleted successfully!');
                logout();
                navigate('/login');
            } else {
                console.error('Error deleting profile:', response.statusText);
                setSuccessMessage('Error deleting profile.');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            setSuccessMessage('Error deleting profile.');
        } finally {
            setIsDeleting(false); // End the deletion process
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) {
        navigate('/login');
        return <p>No user found</p>;
    }

    const isAdminOrCurrentUser = user.username?.toLowerCase() === username?.toLowerCase() || user.role === 'admin';

    const handleUpdateSuccess = (updatedUser) => {
        setUser(updatedUser); // Update the user state with the new data
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
                                <img src={user.image_url} alt="User profile" />
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
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">{user.email || 'N/A'}</a></p>
                            {isAdminOrCurrentUser && user?.id && user?.role && (
                                <>
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                    <button className="cta-button" onClick={() => setIsUpdating(true)}>Update</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
                
                {isAdminOrCurrentUser && user?.id && user?.role && (
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

                        {/* Delete Profile Button */}
                        <button
                            className="cta-button_delete-buttonn"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Profile'}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default UserItem;
