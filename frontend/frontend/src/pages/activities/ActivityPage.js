import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]); // State to store fetched activities
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:5000/activity')
      .then(response => response.json())
      .then(data => {
        setActivities(data); // Set the data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setLoading(false); // In case of error, stop loading
      });
  }, []); // Empty dependency array to only run once when the component mounts

  const handleActivityClick = (route) => {
    navigate(`/activities/${route}`);
  };

  return (
    <div className="Destinationpage">
      <section id="activity-section" className="destinations">
        <h1>Activities</h1>
        {loading ? (
          <p>Loading...</p> // Show loading message while fetching
        ) : (
          <div className="destinations-list">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="destination"
                onClick={() => handleActivityClick(activity.name)}
              >
                <div className="dest_info">
                  <h1>{activity.name}</h1>
                  <p><strong>Description:</strong> {activity.description}</p>
                  <p><strong>Duration:</strong> {activity.duration} hours</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivityPage;
