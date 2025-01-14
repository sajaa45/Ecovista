import Cookies from 'js-cookie'; // To access the cookie for JWT token
import { jwtDecode } from 'jwt-decode'; // To decode the JWT token
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';

const ActivityItem = () => {
  const { name } = useParams(); // Get the destination name from the URL
  const [activity, setActivity] = useState(null); // State to store fetched activity details
  const [loading, setLoading] = useState(true); // Loading state
  const [currentUserId, setCurrentUserId] = useState(null); // Current user's ID
  const [userRole, setUserRole] = useState(null); // Current user's role
  
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

  const fetchActivityDetails = (name) => {
    fetch(`http://127.0.0.1:5000/activity/${name}`)
      .then(response => response.json())
      .then(data => {
        setActivity(data); // Set the activity data
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching activity details:', error);
        setLoading(false); // In case of error, stop loading
      });
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
            <h1><strong>{activity.name.toUpperCase()}</strong></h1>
            <p><strong>Created at:</strong> {new Date(activity.created_at).toLocaleString()}</p>
            {activity.description && (
              <p><strong>Description:</strong> {activity.description}</p>
            )}
            <p><strong>Activity ID:</strong> {activity.id}</p>
            {activity.destinations && activity.destinations.length > 0 ? (
              <p><strong>Destinations:</strong> {activity.destinations.map((destination, index) => (
                <span 
                  key={index} 
                  onClick={() => handleServiceClick(destination)} 
                  className="member-name"
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  {destination}
                  {index < activity.destinations.length - 1 && ', '}
                </span>
              ))}</p>
            ) : (
              <p><strong>Destinations:</strong> None</p>
            )}
            <p><strong>Duration:</strong> {activity.duration} hours</p>
            <p><strong>Maximum Participants:</strong> {activity.max_participants}</p>
            <p><strong>Updated at:</strong> {new Date(activity.updated_at).toLocaleString()}</p>
            
            {canUpdate && (
              <a href="#services-section">
                <button className="cta-button">Update</button>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivityItem;
