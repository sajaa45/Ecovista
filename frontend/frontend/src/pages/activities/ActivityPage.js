import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]); // State to store fetched activities
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:5000/activity')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data); // Set the data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching activities:', error);
        setLoading(false); // Stop loading in case of error
      });
  }, []); // Empty dependency array to only run once when the component mounts

  const handleActivityClick = (route) => {
    navigate(`/activity/${route}`);
  };

  // Filter activities based on search query
  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Destinationpage">
      <section id="activity-section" className="destinations">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for an activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <h1>Activities</h1>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="destinations-list">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="destination"
                onClick={() => handleActivityClick(activity.name)}
              >
                <div className="dest_info">
                  <h1>{activity.name.toUpperCase()}</h1>
                  <p><strong>Description:</strong> {activity.description}</p>
                  <p><strong>Duration:</strong> {activity.duration} hours</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No activity found.</p>
        )}
      </section>
    </div>
  );
};

export default ActivityPage;
