import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/App.css';

const GroupItem = () => {
  const { group_name } = useParams(); // Get the group name from the URL
  const [group, setGroup] = useState(null); // State to store fetched group details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data when the component mounts
  useEffect(() => {
    setLoading(true);
    setError(null); // Reset error state on new fetch
    fetch(`http://127.0.0.1:5000/travel-group/${group_name}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setGroup(data); // Set the data to state
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching group details:', error);
        setError(error.message); // Set error message to state
        setLoading(false); // Stop loading on error
      });
  }, [group_name]);

  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message if there's an issue
  }

  if (!group) {
    return <p>No activity found</p>; // Handle the case when the group is not found
  }

  return (
    <div className="Destinationpage">
      <section name="destination-item-section" className="destination-item">
        <div className="activity-details">
          <div className="destt_info">
            <h1><strong>{group.group_name.toUpperCase()}</strong></h1>
            <p><strong>Created at:</strong> {new Date(group.created_at).toLocaleString()}</p>
            {group.description && (
              <p><strong>Description:</strong> {group.description}</p>
            )}
            <p><strong>Destination:</strong> {group.destination}</p>
            {group.members && group.members.length > 0 ? (
              <p><strong>Members:</strong> {group.members.join(', ')}</p>
            ) : (
              <p><strong>Members:</strong> None</p>
            )}
            <p><strong>From</strong> {group.start_date} <strong> to</strong> {group.end_date}</p>
            <p><strong>Contact Info:</strong> <a href={`mailto:${group.contact_info}`} target="_blank" rel="noopener noreferrer">
    {group.contact_info}
  </a></p>
            <a href="#services-section">
              <button className="cta-button">Update</button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroupItem;
