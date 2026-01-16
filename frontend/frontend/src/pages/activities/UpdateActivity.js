import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateActivity = ({ activity, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: activity.name || '',
    description: activity.description || '',
    duration: activity.duration || '',
    max_participants: activity.max_participants || '',
    destinations: activity.destinations || [],
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'destinations' ? value.split(',').map((item) => item.trim()) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_ACTIVITY_API}/activity/${activity.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update activity');
        setSuccessMessage('');
        return;
      }

      const updatedActivity = await response.json();
      onUpdateSuccess(updatedActivity); // Callback on successful update
      setSuccessMessage('Activity updated successfully!');
      setErrorMessage('');
      navigate(`/activities/${updatedActivity.name}`); // Navigate to the updated activity page
    } catch (error) {
      console.error('Error updating activity:', error);
      setErrorMessage('An error occurred while updating the activity');
    }
  };

  return (
    <div className="update">
      <h2>Update Activity</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
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
          Duration (in hours):
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Max Participants:
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Destinations (comma-separated):
          <input
            type="text"
            name="destinations"
            value={formData.destinations.join(', ')}
            onChange={handleInputChange}
          />
        </label>
        <div className="button-group">
          <button type="submit" className="cta-button">Save Changes</button>
          <button type="button" className="cta-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateActivity;
