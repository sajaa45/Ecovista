import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwt-decode
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import { AddReview } from '../reviews/AddReview'; // Adjust the import path as necessary

const DestinationItem = () => {
  const { name } = useParams(); // Get the destination name from the URL
  const [destination, setDestination] = useState(null); // State to store fetched destination details
  const [loading, setLoading] = useState(true); // Loading state
  const [role, setRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility
  const navigate = useNavigate(); // Use navigate for redirection

  const fetchDestinationDetails = async (name) => {
    const token = Cookies.get('jwt');

    try {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Assuming the role is stored in the 'role' key
      console.log("User  Role:", decodedToken.role); // Log the role after setting it

      const response = await fetch(`http://127.0.0.1:5000/destinations/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch destination details');
      }

      const data = await response.json();
      setDestination(data);
    } catch (error) {
      console.error('Error fetching destination details:', error);
      navigate('/error'); // Redirect to an error page or handle the error appropriately
    } finally {
      setLoading(false);
    }
  };

   // In DestinationItem component
   useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Assuming the role is stored in the 'role' key
    }
    fetchDestinationDetails(name);
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
            <p><strong>Destination ID:</strong> {destination.id}</p>
            {destination.activities && destination.activities.length > 0 && (
              <p><strong>Activities:</strong> {destination.activities.join(', ')}</p>
            )}
        <div className='add_review'>
          {role !== "admin" ? (
            <>
              <AddReview
                buttonText="Add Your Review"
                title="Add Your Review"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </>
          ) : (
            <a href="#services-section">
              <button className="cta-button">Update</button>
            </a>
          )}
        </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationItem;