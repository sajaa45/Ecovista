import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateDestination = ({ destination, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: destination.name || '',
    location: destination.location || '',
    image_url: destination.image_url || '',
    description: destination.description || '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_DESTINATION_API}/destinations/${destination.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update destination');
        setSuccessMessage('');
        return;
      }

      const updatedDestination = await response.json();
      onUpdateSuccess(updatedDestination); // Callback on successful update
      setSuccessMessage('Destination updated successfully!');
      setErrorMessage('');
      navigate(`/destinations/${updatedDestination.name}`); // Navigate to the updated destination page
    } catch (error) {
      console.error('Error updating destination:', error);
      setErrorMessage('An error occurred while updating the destination');
    }
  };

  return (
    <div className="destination-update">
      <h2>Update Destination</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image URL:</label>
          <input
            id="image_url"
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="cta-button">Save Changes</button>
          <button type="button" className="cta-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
  
};

export default UpdateDestination;
