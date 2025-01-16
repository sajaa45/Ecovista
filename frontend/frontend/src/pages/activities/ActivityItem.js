import Cookies from 'js-cookie'; // To access the cookie for JWT token
import { jwtDecode } from 'jwt-decode'; // To decode the JWT token
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import UpdateActivity from './UpdateActivity'; // Import the UpdateActivity component

const ActivityItem = () => {
  const { name } = useParams(); // Get the activity name from the URL
  const [activity, setActivity] = useState(null); // State to store fetched activity details
  const [loading, setLoading] = useState(true); // Loading state
  const [currentUserId, setCurrentUserId] = useState(null); // Current user's ID
  const [userRole, setUserRole] = useState(null); // Current user's role
  const [updateMode, setUpdateMode] = useState(false); // Control update mode
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Fetch activity data when the component mounts
  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); // Set the user's role
        setCurrentUserId(decodedToken.user_id); // Set the current user's ID
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }

    // Fetch the activity details
    fetchActivityDetails(name);
  }, [name]);

  const fetchActivityDetails = async (name) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/activity/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity details');
      }
      const data = await response.json();
      setActivity(data);
    } catch (error) {
      console.error('Error fetching activity details:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteActivity = () => {
    if (window.confirm(`Are you sure you want to delete the activity: ${activity.name}?`)) {
      const token = Cookies.get('jwt'); // Fetch token
      if (!token) {
        alert('Authentication required. Please log in.');
        return;
      }
  
      fetch(`http://127.0.0.1:5000/activity/${activity.name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || 'Failed to delete activity');
            });
          }
          alert('Activity deleted successfully');
          navigate(`/activities`); // Redirect to the destination page
        })
        .catch((error) => {
          console.error('Error deleting activity:', error);
          alert(error.message || 'Failed to delete activity');
        });
    }
  };
  
  const handleUpdateSuccess = (updatedActivity) => {
    setActivity(updatedActivity);
    setUpdateMode(false); // Close update mode
    setSuccessMessage('Activity updated successfully!');
    setErrorMessage('');
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching
  }

  if (!activity) {
    return <p>No activity found</p>; // Handle the case when activity is not found
  }

  const handleServiceClick = (destination) => {
    navigate(`/destinations/${destination}`); // Navigate using the specific destination
  };

  // Check if the current user is the creator or an admin
  const canUpdate = currentUserId === activity.creator_id || userRole === 'admin';

  return (
    <div className="Destinationpage">
      <section name="destination-item-section" className="destination-item">
        <div className="activity-details">
          <div className="destt_info">
            {updateMode ? (
              <UpdateActivity
                activity={activity}
                onUpdateSuccess={handleUpdateSuccess} // Pass success callback
                onCancel={() => setUpdateMode(false)} // Cancel callback
              />
            ) : (
              <>
                <h1><strong>{activity.name.toUpperCase()}</strong></h1>
                <p><strong>Created at:</strong> {new Date(activity.created_at).toLocaleString()}</p>
                {activity.description && (
                  <p><strong>Description:</strong> {activity.description}</p>
                )}
                <p><strong>Activity ID:</strong> {activity.id}</p>
                {activity.destinations && activity.destinations.length > 0 ? (
                  <p>
                    <strong>Destinations:</strong>
                    {activity.destinations.map((destination, index) => (
                      <span
                        key={index}
                        onClick={() => handleServiceClick(destination)}
                        className="member-name"
                      >
                        {destination}
                        {index < activity.destinations.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p><strong>Destinations:</strong> None</p>
                )}
                <p><strong>Duration:</strong> {activity.duration} hours</p>
                <p><strong>Maximum Participants:</strong> {activity.max_participants}</p>
                <p><strong>Updated at:</strong> {new Date(activity.updated_at).toLocaleString()}</p>
                <div className="add_review">
                  {canUpdate && (
                    <>
                      <button
                        type="button"
                        className="cta-button"
                        onClick={() => setUpdateMode(true)} // Switch to update mode
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="cta-button"
                        onClick={handleDeleteActivity}
                      >
                        Delete Location
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivityItem;
