import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import { AddReview } from '../reviews/AddReview';
import UpdateDestination from './UpdateDestination'; // Import the UpdateDestination component

const DestinationItem = () => {
  const { name } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState(false); // Control update mode
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setUserId(decodedToken.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    fetchDestinationDetails(name);
  }, [name]);

  const handleServiceClick = (activity) => {
    navigate(`/activities/${activity}`);
  };
  const handleDeleteDestination = () => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      const token = Cookies.get('jwt'); // Fetch token
      if (!token) {
        alert('Authentication required. Please log in.');
        return;
      }
  
      fetch(`http://127.0.0.1:5000/destinations/${destination.name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || 'Failed to delete destination');
            });
          }
          alert('Destination deleted successfully');
          navigate('/destinations'); // Redirect to the destinations page
        })
        .catch((error) => {
          console.error('Error deleting destination:', error);
          alert(error.message || 'Failed to delete destination');
        });
    }
  };
  
  
  const handleUpdateSuccess = (updatedDestination) => {
    setDestination(updatedDestination);
    setUpdateMode(false);  // Close update mode
    setSuccessMessage('Destination updated successfully!');
    setErrorMessage('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!destination) {
    return <p>No destination found</p>;
  }

  return (
    <div className="Destinationpage">
      <section name="destination-item-section" className="destination-item">
        <div className="destination-details">
          <div className="destt_img">
            <img src={destination.image_url} alt={destination.name} />
          </div>
          <div className="destt_info">
            {updateMode ? (
              <UpdateDestination
                destination={destination}
                onUpdateSuccess={handleUpdateSuccess} // Pass success callback
                onCancel={() => setUpdateMode(false)}  // Cancel callback
              />
            ) : (
              <>
                <h1><strong>{destination.name.toUpperCase()}</strong></h1>
                <p><strong>Location:</strong> {destination.location}</p>
                {destination.description && (
                  <p><strong>Description:</strong> {destination.description}</p>
                )}
                <p><strong>Destination id:</strong> {destination.id}</p>
                {destination.activities && (
                  <p>
                    <strong>Activities:</strong>
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
                {(role === 'admin' || userId === destination.creator_id) ? (
                  <div className="add_review">
                    <button
                      type="button"
                      className="cta-button"
                      onClick={() => setUpdateMode(true)}  // Switch to update mode
                    >
                      Update
                    </button>
                    <button
                        className="cta-button delete-button"
                        onClick={handleDeleteDestination}
                      >Delete Location</button>
                  </div>
                ) : (
                  <div className='add_review'>
                  <AddReview
                    buttonText="Add Your Review"
                    title="Add Your Review"
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    name={destination.name.toUpperCase()}
                    id={destination.id}
                    username={username}
                    img={image}
                    buttonClass="cta-button"
                  /></div>
                )}
              </>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationItem;
