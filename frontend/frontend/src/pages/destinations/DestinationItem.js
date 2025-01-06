import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/App.css';

const DestinationItem = () => {
  const { name } = useParams(); // Get the destination name from the URL
  const [destination, setDestination] = useState(null); // State to store fetched destination details
  const [loading, setLoading] = useState(true); // Loading state
  
  // Fetch data when the component mounts
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/destinations/${name}`)
      .then(response => {
        return response.json();}
    )
      .then(data => {
        setDestination(data); // Set the data to state
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching destination details:', error);
        setLoading(false); // In case of error, stop loading
      });
  }, [name]);
  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching
  }

  if (!destination) {
    return <p>No destination found</p>; // Handle the case when destination is not found
  }

  return (
    <div className="Destinationpage">
      <section name="destination-item-section" className="destination-item">
        
        <div className="destination-details">
          <div className="destt_img">
            <img src={destination.image_url} alt={destination.name} />
          </div>
          <div className="destt_info">
            <h1><strong>{destination.name.toUpperCase()}</strong></h1>
            <p><strong>Location:</strong> {destination.location}</p>
            {destination.description && destination.description.length > 0 && (
              <p><strong>Description:</strong> {destination.description}</p>
            )}
            <p><strong>Destination id:</strong> {destination.id}</p>
            {destination.activities && destination.activities.length > 0 && (
              <p><strong>Activities:</strong> {destination.activities.join(', ')}</p>
            )}
            <a href="#services-section" ><button className="cta-button">Update</button></a>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default DestinationItem;
