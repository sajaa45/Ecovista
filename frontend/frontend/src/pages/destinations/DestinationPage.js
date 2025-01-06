import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const DestinationPage = () => {
  const [destinations, setDestinations] = useState([]); // State to store fetched destinations
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:5000/destinations')
      .then(response => response.json())
      .then(data => {
        setDestinations(data); // Set the data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching destinations:', error);
        setLoading(false); // In case of error, stop loading
      });
  }, []); // Empty dependency array to only run once when the component mounts

  const handleServiceClick = (route) => {
    navigate(`/destinations/${route}`)
  };

  return (
    <div className="Destinationpage">
      <section id="destination-section" className="destinations">
        <h1>Destinations To Visit</h1>
        {loading ? (
          <p>Loading...</p> // Show loading message while fetching
        ) : (
          <div className="destinations-list">
            {destinations.map((service) => (
              <div
                key={service.id}
                className="destination"
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="dest_img">
                  <img src={service.image_url} alt={service.name} />
                </div>
                <div className="dest_info">
                <h1>{service.name}</h1>
                <p>{service.location}</p></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DestinationPage;
