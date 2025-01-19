import Cookies from 'js-cookie';
import React, { useState } from 'react';

export const AddDestination = ({ setIsAdding, onDestinationAdded }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newDestination = { 
        name, 
        location, 
        description, 
        image_url: imageUrl || 'https://static.vecteezy.com/system/resources/previews/004/141/669/large_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' 
      };
      const token = Cookies.get('jwt'); // Get the JWT token from cookies
      console.log('JWT Token:', token);
      if (!token) {
        setErrorMessage('Missing JWT token. Please log in.'); // Set error message if no token
        return;
      }
  
      try {
        const response = await fetch('http://127.0.0.1:5000/destinations', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newDestination),
        });
  
        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          setErrorMessage(errorData.message || 'Failed to add destination'); // Set error message from backend
          throw new Error(errorData.message || 'Failed to add destination');
        }
  
        onDestinationAdded(); // Trigger parent re-fetch of destinations
        setIsAdding(false); // Close the form after adding the destination
      } catch (error) {
        console.error('Error adding destination:', error);
      }
    };
    return (
      <div className="overlay">
        <div className="popout-form-container">
          <h2 className="popout-header">Add New Destination</h2>
          <form className="popout-form" onSubmit={handleSubmit}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="input-field"
              />
            </label>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input-field"
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input-field"
              />
            </label>
            <div className="button-group">
              <button type="submit" className="cta-button">Add Destination</button>
              <button
                type="button"
                className="cta-button cancel-button"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
    
    
  };
  