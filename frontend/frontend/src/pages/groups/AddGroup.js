import Cookies from 'js-cookie';
import React, { useState } from 'react';

export const AddGroup = ({ setIsAdding }) => {
  const [formData, setFormData] = useState({
    group_name: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    contact_info: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Reset error message before request
    const token = Cookies.get('jwt'); // Get the JWT token from cookies

    if (!token) {
      setErrorMessage('Missing JWT token. Please log in.'); // Display error if no token
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/travel-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        setErrorMessage(errorData.message || 'Failed to create travel group'); // Display the error message from backend
        throw new Error(errorData.message || 'Failed to create travel group');
      }

      const data = await response.json(); // Parse the successful response
      console.log('Group created:', data);
      window.location.reload(); // Reload to show the new group
    } catch (err) {
      console.error('Error adding group:', err);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="overlay">
      <div className="popout-form-container">
        <h2 className="popout-header">Add New Travel Group</h2>

        {/* Display the error message if exists */}
        {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

        <form className="popout-form" onSubmit={handleSubmit}>
          <label>
            Group Name:
            <input
              type="text"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

          <label>
            Destination:
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

          <label>
            Start Date:
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
            />
          </label>

          <label>
            Contact Info:
            <input
              type="text"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

          <div className="button-group">
            <button type="submit" className="cta-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Group'}
            </button>
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
