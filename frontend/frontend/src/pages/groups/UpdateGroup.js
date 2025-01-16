import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const UpdateGroup = ({ group, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    group_name: group.group_name || '',
    destination: group.destination || '',
    start_date: group.start_date || '',
    end_date: group.end_date || '',
    description: group.description || '',
    contact_info: group.contact_info || '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    // Simple client-side validation
    if (!formData.group_name.trim() || !formData.destination.trim()) {
        setErrorMessage('Group name and destination are required.');
        return;
    }
    e.preventDefault();
    const token = Cookies.get('jwt');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');  // Redirect to login if no token
                    return;
                }
    try {
      const response = await fetch(`http://127.0.0.1:5000/travel-group/${group.group_name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update group');
        setSuccessMessage('');
        return;
      }

      const updatedGroup = await response.json();
      onUpdateSuccess(updatedGroup); // Callback on successful update
      setSuccessMessage('Travel group updated successfully!');
      setErrorMessage('');
      navigate(`/travel-groups/${updatedGroup.group_name}`); // Navigate to the updated group page
    } catch (error) {
      console.error('Error updating group:', error);
      setErrorMessage('An error occurred while updating the travel group');
    }
  };

  return (
    <div className="group-update">
      <h2>Update Travel Group</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Group Name:
          <input
            type="text"
            name="group_name"
            value={formData.group_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Destination:
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Contact Info:
          <input
            type="text"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleInputChange}
          />
        </label>
        <div className="button-group">
          <button type="submit" className="cta-button">{loading ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" className="cta-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateGroup;
