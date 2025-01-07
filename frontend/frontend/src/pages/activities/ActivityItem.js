import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/App.css';

const ActivityItem = () => {
  const { name } = useParams(); // Get the destination name from the URL
  const [activity, setActivity] = useState(null); // State to store fetched destination details
  const [loading, setLoading] = useState(true); // Loading state
  
  // Fetch data when the component mounts
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/activity/${name}`)
      .then(response => {
        return response.json();}
    )
      .then(data => {
        setActivity(data); // Set the data to state
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching activity details:', error);
        setLoading(false); // In case of error, stop loading
      });
  }, [name]);
  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching
  }

  if (!activity) {
    return <p>No activity found</p>; // Handle the case when destination is not found
  }

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
              <p><strong>Destinations:</strong> {activity.destinations.join(', ')}</p>
            ) : (
              <p><strong>Destinations:</strong> None</p>
            )}
            <p><strong>Duration:</strong> {activity.duration} hours</p>
            <p><strong>Maximum Participants:</strong> {activity.max_participants}</p>
            <p><strong>Updated at:</strong> {new Date(activity.updated_at).toLocaleString()}</p>
            <a href="#services-section" ><button className="cta-button">Update</button></a>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default ActivityItem;
