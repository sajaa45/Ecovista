import Cookies from 'js-cookie';
import { useState } from 'react';

const UpdateProfile = ({ user, onUpdateSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        image_url: user.image_url || '',
        username: user.username || '', // Allow username update
        password: '', // Include current_password for validation
        new_password: '', // Allow new password update
    });

    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('jwt');

        try {
            const response = await fetch(`${process.env.REACT_APP_USER_API}/users/${user.username}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Set the error message from the response
                setErrorMessage(errorData.message || 'Failed to update profile');
                throw new Error('Failed to update profile');
            }

            const updatedUser  = await response.json();
            onUpdateSuccess(updatedUser ); // Call the success handler with updated user data
            setErrorMessage(''); // Clear any previous error messages
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className='destinationn'>
            <div className="destt_info">
                <h2>Update Profile</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div className="detaailss">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Profile Image URL:
                            <input
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Username (Optional):
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Current Password:
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            New Password (Optional):
                            <input
                                type="password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className="button-group">
                        <button type="submit" className="cta-button">Save Changes</button>
                        <button type="button" className="cta-button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default UpdateProfile;