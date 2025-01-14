import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const GroupPage = () => {
  const [groups, setGroups] = useState([]); // State to store fetched destinations
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/travel-group');
        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }
        const data = await response.json();
        setGroups(data); // Set the data to state
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchDestinations();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleServiceClick = (route) => {
    navigate(`/travel-groups/${route}`);
  };

  // Filter destinations based on search query
  const filteredDestinations = groups.filter((destination) =>
    destination.group_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Destinationpage">
      <section id="destination-section" className="destinations">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <h1>Available Travel Groups</h1>
        </div>
        {loading ? (
          <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="destinations-list">
            {filteredDestinations.map((service) => (
              <div
                key={service.id}
                className="destination"
                onClick={() => handleServiceClick(service.group_name)}
              >
                <div className="dest_info">
                  <h1>{service.group_name.toUpperCase()}</h1>
                  <h2>{service.destination}</h2>
                  <p><strong>From: </strong>{service.start_date}</p>
                  <p><strong>To: </strong>{service.end_date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No destinations found.</p>
        )}
      </section>
    </div>
  );
};

export default GroupPage;
