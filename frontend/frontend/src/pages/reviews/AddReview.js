import Cookies from 'js-cookie';
import React, { useState } from 'react';

export function AddReview({ children, buttonText = "Open Modal", title = "Modal", isOpen, setIsOpen, name, id, username, img }) {
  const [showForm, setShowForm] = useState(true); // State to toggle form visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); 
  const [newReview, setNewReview] = useState({
    rating: '',
    comment: '',
  }); 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message
    setSuccessMessage(''); // Clear previous success message
  
    try {
      // Validate input fields
      if (!newReview.rating || !newReview.comment) {
        throw new Error('All fields are required.');
      }
  
      const token = Cookies.get('jwt'); // Get the JWT token from cookies
      console.log('JWT Token:', token);
      if (!token) {
        throw new Error('Missing JWT token. Please log in.');
      }
  
      const response = await fetch('http://127.0.0.1:5000/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({
          destination: name,
          rating: newReview.rating,
          comment: newReview.comment,
          username: username, // Include username
          image_url: img, // Include image
          destination_id: id // Include destination ID if needed
        })
      });
  
      if (!response.ok) {
        const errData = await response.json();
        console.error('Error response:', errData);
        throw new Error(errData.msg || 'Failed to add review.');
      }
  
      const data = await response.json();
      console.log('Response Data:', data);
      setSuccessMessage('Review added successfully!');
      setNewReview({ rating: '', comment: '' }); // Reset the form
      setShowForm(false); // Hide the form
      setIsOpen(false); // Close the modal
    } catch (error) {
      console.error('Error adding review:', error);
      setErrorMessage(error.message || 'Error adding review. Please try again.');
    }
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
              <label style={{  alignSelf: "flex-start", textAlign: "left" ,paddingLeft: "70px" }}>Destination:</label>
              <div className="input-field">
                <label>{name}</label> {/* Display the destination name */}
              </div>
              <label style={{  alignSelf: "flex-start", textAlign: "left" ,paddingLeft: "70px" }}>Destination id:</label>
              <div className="input-field">
                <label>{id}</label> {/* Display the ID */}
              </div>
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
