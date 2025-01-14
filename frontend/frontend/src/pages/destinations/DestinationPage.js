import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import { AddDestination } from './AddDestination'; // Assuming AddDestination is a child component

const DestinationPage = () => {
  const [destinations, setDestinations] = useState([]); // State to store fetched destinations
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true); // Loading state
  const [isAdding, setIsAdding] = useState(false); // State to track if the Add Destination form is visible
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/destinations');
        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }
        const data = await response.json();
        setDestinations(data); // Set the data to state
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchDestinations();
  }, []); // Empty dependency array ensures this runs once when the component mounts
  const handleDestinationAdded = () => {
    // Fetch the latest destinations after adding a new one
    const fetchDestinations = async () => {
      const response = await fetch('http://127.0.0.1:5000/destinations');
      const data = await response.json();
      setDestinations(data);
    };

    fetchDestinations();
  };

  const handleServiceClick = (route) => {
    navigate(`/destinations/${route}`);
  };

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1>Destinations To Visit</h1>
        </div>

        {/* Show the button to add a destination */}
        {!isAdding && (
          <button className="cta-button" onClick={() => setIsAdding(true)}>
            Add Destination
          </button>
        )}

        {/* If the "Add Destination" button is clicked, show the form */}
        {isAdding && <AddDestination setIsAdding={setIsAdding} onDestinationAdded={handleDestinationAdded}/>}

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
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="dest_img">
                  <img src={service.image_url} alt={service.name} />
                </div>
                <div className="dest_info">
                  <h1>{service.name.toUpperCase()}</h1>
                  <p>{service.location}</p>
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


export default DestinationPage; 