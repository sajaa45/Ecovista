import Cookies from 'js-cookie'; // Make sure to import your cookie library
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css';
import UpdateGroup from './UpdateGroup'; // Import the UpdateGroup component

const GroupItem = () => {
  const { group_name } = useParams(); // Get the group name from the URL
  const [group, setGroup] = useState(null); // State to store fetched group details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isMember, setIsMember] = useState(false); // State to track if the user is a member
  const [currentUser, setCurrentUser] = useState(null); // State for user info extracted from token
  const [updateMode, setUpdateMode] = useState(false); // State to toggle update mode

  const navigate = useNavigate();

  // Decode token and set user details
  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUser({
          user_id: decodedToken.user_id,
          username: decodedToken.username,
          role: decodedToken.role,
        });
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  // Fetch data when the component mounts
  useEffect(() => {
    if (!currentUser) return; // Ensure user details are loaded first
    setLoading(true);
    setError(null); // Reset error state on new fetch
    fetch(`http://127.0.0.1:5000/travel-group/${group_name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setGroup(data); // Set the data to state
        setIsMember(data.members.includes(currentUser.username)); // Check if the user is a member
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching group details:', error);
        setError(error.message); // Set error message to state
        setLoading(false); // Stop loading on error
      });
  }, [group_name, currentUser]);

  const handleJoinLeave = () => {
    const action = isMember ? 'leave' : 'join';
  
    // Prompt the user with a confirmation dialog before proceeding
    const confirmationMessage = isMember
      ? 'Are you sure you want to leave this group?'
      : 'Are you sure you want to join this group?';
  
    if (window.confirm(confirmationMessage)) {
      const token = Cookies.get('jwt');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }
  
      // Update the group members on the backend (Join or Leave)
      fetch(`http://127.0.0.1:5000/travel-group/${group_name}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setGroup(data); // Update the group data after successful join/leave
          setIsMember(action === 'join'); // Update membership status
        })
        .catch((error) => {
          console.error('Error updating membership status:', error);
          setError('Error updating membership status');
        });
    }
  };
  

  const handleDeleteGroup = () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      const token = Cookies.get('jwt'); // Fetch token
      if (!token) {
        alert('Authentication required. Please log in.');
        return;
      }

      fetch(`http://127.0.0.1:5000/travel-group/${group_name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || 'Failed to delete group');
            });
          }
          alert('Group deleted successfully');
          navigate('/travel-groups'); // Redirect to the homepage
        })
        .catch((error) => {
          console.error('Error deleting group:', error);
          alert(error.message || 'Failed to delete group');
        });
    }
  };

  const handleUpdateSuccess = (updatedGroup) => {
    setGroup(updatedGroup); // Update the group data with the updated group
    setUpdateMode(false); // Exit update mode
  };

  if (loading || !currentUser) {
    return <p>Loading...</p>; // Show loading message while fetching
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message if there's an issue
  }

  if (!group) {
    return <p>No activity found</p>; // Handle the case when the group is not found
  }

  const canDeleteGroup =
    group.creator_id === currentUser.user_id || currentUser.role === 'admin';
    const handleServiceClick = (route) => {
      navigate(`/users/${route}`);
    };
    const handleServicClick = (route) => {
      navigate(`/destinations/${route}`);
    };
  return (
    <div className="Destinationpage">
      <section name="destination-item-section" className="destination-item">
        {updateMode ? (
          <UpdateGroup
            group={group}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={() => setUpdateMode(false)}
          />
        ) : (
          <div className="activity-details">
            <div className="destt_info">
              <h1>
                <strong>{group_name.toUpperCase()}</strong>
              </h1>
              <p>
                <strong>Created at:</strong> {new Date(group.created_at).toLocaleString()}
              </p>
              {group.description && (
                <p>
                  <strong>Description:</strong> {group.description}
                </p>
              )}
              <p>
              <strong>Destination:</strong>
              <span
                        onClick={() => handleServicClick(group.destination)}
                        className="member-name"
                        style={{ cursor: 'pointer', color: 'blue' }}
                      >
                        {group.destination}
                      </span>
                 
              </p>
              { group.members && group.members.length > 0 ? (
              <p>
                <strong>Members:</strong>{' '}
                {group.members.map((member, index) => (
                  <span
                    key={index}
                    onClick={() => handleServiceClick(member)}
                    className="member-name"
                  >
                    {member}
                    {index < group.members.length - 1 ? ', ' : ''}
                  </span>
                ))}
                </p>
              ) : (
                <p>
                  <strong>Members:</strong> None
                </p>
              )}
              <p>
                <strong>From</strong> {group.start_date} <strong> to</strong> {group.end_date}
              </p>
              <p>
                <strong>Contact Info:</strong>{' '}
                <a href={`mailto:${group.contact_info}`} target="_blank" rel="noopener noreferrer">
                  {group.contact_info}
                </a>
              </p>
              <div className='member'>
                <div className='add_review'>
                  {canDeleteGroup ? (
                    <>
                      <button
                        className="cta-button"
                        onClick={() => setUpdateMode(true)} // Activate update mode
                      >
                        Update
                      </button>
                      <button
                        className="cta-button delete-button"
                        onClick={handleDeleteGroup}
                      >
                        Delete Group
                      </button>
                    </>
                  ) : (
                    <button className="cta-button" onClick={handleJoinLeave}>
                      {isMember ? 'Leave Group' : 'Join Group'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default GroupItem;
