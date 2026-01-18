import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import { AddActivity } from './AddActivity'; // Assuming AddActivity is a child component

const ActivityPage = () => {
  const [activities, setActivities] = useState([]); // State to store fetched activities
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true); // Loading state
  const [isAdding, setIsAdding] = useState(false); // State to track if the Add Activity form is visible
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ACTIVITY_API}/activity`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data); // Set the data to state
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchActivities();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleActivityClick = (route) => {
    navigate(`/activities/${route}`);
  };

  // Filter activities based on search query
  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to refresh the list of activities
  const refreshPage = async () => {
    setLoading(true); // Set loading to true while refetching
    try {
      const response = await fetch(`${process.env.REACT_APP_ACTIVITY_API}/activity`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setActivities(data); // Update the activities with the latest data
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false); // Stop loading after the data is fetched
    }
  };

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

        {/* Show the button to add an activity */}
        {!isAdding && (
          <button className="cta-button" onClick={() => setIsAdding(true)}>
            Add Activity
          </button>
        )}

        {/* If the "Add Activity" button is clicked, show the form */}
        {isAdding && <AddActivity setIsAdding={setIsAdding} refreshPage={refreshPage} />}

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
