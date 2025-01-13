import Cookies from 'js-cookie';
import React, { useState } from 'react';

export function AddReview({ children, buttonText = "Open Modal", title = "Modal", isOpen, setIsOpen }) {
  const [showForm, setShowForm] = useState(true); // State to toggle form visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); 
  const [newReview, setNewReview] = useState({
    destination: '',
    rating: '',
    comment: '',
  }); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // In AddReview component
const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Validate input fields
    if (!newReview.destination || !newReview.rating || !newReview.comment) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    const token = Cookies.get('jwt'); // Get the JWT token from cookies
  
    // Send the POST request to add a new review
    fetch('http://127.0.0.1:5000/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token
      },
      body: JSON.stringify({
        ...newReview,
        image_url: 'user_image_url_here', // Replace with actual image URL from user context
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || 'Failed to add review.');
          });
        }
        return response.json();
      })
      .then((data) => {
        setSuccessMessage('Review added successfully!');
        setNewReview({ destination: '', rating: '', comment: '' }); // Reset the form
        setShowForm(true); // Hide the form
        setIsOpen(false); // Close the modal
      })
      .catch((error) => {
        console.error('Error adding review:', error);
        setErrorMessage(error.message || 'Error adding review. Please try again.');
      });
  };
  
 
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="cta-button">
        {buttonText}
      </button>
      {isOpen && (
        <div className="modal">
          <h2>{title}</h2>
          <div className='add_review'>
          {showForm && (
            <form className="add-review-form" onSubmit={handleFormSubmit}>
              <h2>Add Your Review</h2>
              <input
                type="text"
                name="destination"
                placeholder="Your destination"
                value={newReview.destination}
                onChange={handleInputChange}
                className="input-field"
              />
              <input
                type="number"
                name="rating"
                placeholder="Rating (1-5)"
                value={newReview.rating}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                max="5"
              />
              <textarea
                name="comment"
                placeholder="Your review"
                value={newReview.comment}
                onChange={handleInputChange}
                className="input-field"
              />
              <button type="submit" className="cta-button">Submit Review</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
          )}
          </div>
          <button onClick={() => setIsOpen(false)} className="cta-button">Close</button>
        </div>
            )}
          </>
        );
      }