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

  const [errorMessage, setErrorMessage] = useState(''); // Use the same error message state as AddDestination
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
          console.log('JWT Token:', token);
          if (!token) {
            setErrorMessage('Missing JWT token. Please log in.'); // Set error message if no token
            return;
          }
    try {
      const response = await fetch('http://127.0.0.1:5000/travel-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        setErrorMessage(errorData.msg || 'Failed to create travel group'); // Set error message
        throw new Error(errorData.msg || 'Failed to create travel group');
      }

      const data = await response.json();
      console.log('Group created:', data);

      window.location.reload(); // Reload to show new group
    } catch (err) {
      console.error('Error adding group:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add_review">
      <h2>Add New Travel Group</h2>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
      <form className="add-review-form" onSubmit={handleSubmit}>
        <label className="input-field">
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
        <label className="input-field">
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
        <label className="input-field">
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
        <label className="input-field">
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
        <label className="input-field">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label className="input-field">
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
        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Group'}
        </button>
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
