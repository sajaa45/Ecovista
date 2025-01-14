import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import { AddReview } from '../reviews/AddReview';

const DestinationItem = () => {
  const { name } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null); // Store user ID from JWT
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const fetchDestinationDetails = async (name) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/destinations/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch destination details');
      }
      const data = await response.json();
      setDestination(data);
    } catch (error) {
      console.error('Error fetching destination details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        setUsername(decodedToken.username);
        setImage(decodedToken.img || 'https://static.vecteezy.com/system/resources/previews/004/141/669/large_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg');
        setUserId(decodedToken.user_id); // Extract and store user ID
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    fetchDestinationDetails(name);
  }, [name]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!destination) {
    return <p>No destination found</p>;
  }

  // Handle click for activities, dynamically using the clicked activity
  const handleServiceClick = (activity) => {
    navigate(`/activities/${activity}`); // Navigate using the specific activity
  };
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
              <p><strong>Activities:</strong>
                {destination.activities.map((activity, index) => (
                  <span 
                    key={index} 
                    onClick={() => handleServiceClick(activity)} 
                    className="member-name"
                    style={{ cursor: 'pointer', color: 'blue' }}
                  >
                    {activity}
                    {index < destination.activities.length - 1 && ', '}
                  </span>
                ))}
              </p>
            )}
            <div className='add_review'>
              {(role === "admin" || userId === destination.creator_id) ? (
                <><a href="#services-section">
                  <button className="cta-button">Update</button>
                </a>
                <button
                type="button"
                className="cta-button"
              >
                Delete Location
              </button></>
              ) : (
                <AddReview
                  buttonText="Add Your Review"
                  title="Add Your Review"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  name={destination.name.toUpperCase()}
                  id={destination.id}
                  username={username}
                  img={image}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationItem;
