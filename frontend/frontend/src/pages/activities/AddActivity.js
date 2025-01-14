import Cookies from 'js-cookie';
import React, { useState } from 'react';

export const AddActivity = ({ setIsAdding, refreshPage }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [destinations, setDestinations] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newActivity = { 
      name,
      description,
      duration,
      max_participants: maxParticipants,
      destinations: destinations.split(',').map((dest) => dest.trim()), // Convert comma-separated destinations to an array
    };
    const token = Cookies.get('jwt'); // Get the JWT token from cookies
    console.log('JWT Token:', token);
    if (!token) {
      setErrorMessage('Missing JWT token. Please log in.'); // Set error message if no token
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/activity', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newActivity),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        setErrorMessage(errorData.msg || 'Failed to add activity'); // Set error message from backend
        throw new Error(errorData.msg || 'Failed to add activity');
      }

      setIsAdding(false); // Close the form after adding the activity

      if (refreshPage) {
        refreshPage(); // Refresh the parent page
      }

    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <div className="add_review">
      <h2>Add New Activity</h2>
      <form className="add-review-form" onSubmit={handleSubmit}>
        
        {errorMessage && <p className="error-message" style={{color:"red"}}>{errorMessage}</p>} {/* Display error message */}
        
        <label className="input-field">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
        </label>
        
        <label className="input-field">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="input-field"
          />
        </label>
        
        <label className="input-field">
          Duration (in hours):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="input-field"
          />
        </label>
        
        <label className="input-field">
          Max Participants:
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            required
            className="input-field"
          />
        </label>

        <label className="input-field">
          Destinations (comma-separated):
          <input
            type="text"
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
            required
            className="input-field"
          />
        </label>
        
        <button type="submit" className="cta-button">Add Activity</button>
        <button
          type="button"
          className="cta-button"
          onClick={() => setIsAdding(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
