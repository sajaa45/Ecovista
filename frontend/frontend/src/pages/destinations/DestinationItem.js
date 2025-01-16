import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import { AddReview } from '../reviews/AddReview';
import UpdateDestination from './UpdateDestination'; // Import the UpdateDestination component

const DestinationItem = () =>  {
  const { name } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [updateMode, setUpdateMode] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successMessageFromChild, setSuccessMessageFromChild] = useState('');

  const handleSuccessMessage = (message) => {
    setSuccessMessageFromChild(message);
  };

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
        setImage(decodedToken.img || 'default-image.jpg');
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
      const token = Cookies.get('jwt'); 
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
          navigate('/destinations'); 
        })
        .catch((error) => {
          console.error('Error deleting destination:', error);
          alert(error.message || 'Failed to delete destination');
        });
    }
  };

  const handleUpdateSuccess = (updatedDestination) => {
    setDestination(updatedDestination);
    setUpdateMode(false);  
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
      <section className="destination-item">
        <div className="destination-details">
          <div className="destt_img">
            <img src={destination.image_url} alt={destination.name} />
          </div>
          <div className="destt_info">
            {successMessageFromChild && <p className="success-message">{successMessageFromChild}</p>}
            {updateMode ? (
  <div className="update-form-container">
    <div className="update-form">
      <UpdateDestination
        destination={destination}
        onUpdateSuccess={handleUpdateSuccess}
        onCancel={() => setUpdateMode(false)}
      />
      <button className="close-button" onClick={() => setUpdateMode(false)}>
        Cancel
      </button>
    </div>
  </div>
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
          onClick={() => setUpdateMode(true)}
        >
          Update
        </button>
        <button
          className="cta-button delete-button"
          onClick={handleDeleteDestination}
        >
          Delete Location
        </button>
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
          onSuccess={handleSuccessMessage}
        />
      </div>
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
