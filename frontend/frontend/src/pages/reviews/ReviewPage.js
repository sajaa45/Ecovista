import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import '../../styles/App.css';

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]); // State to store fetched reviews
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true); 
  const [newReview, setNewReview] = useState({
    destination: '',
    rating: '',
    comment: '',
  }); // State for the new review
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://127.0.0.1:5000/review') // Adjust API endpoint for reviews
      .then((response) => response.json())
      .then((data) => {
        setReviews(data); // Set the fetched reviews to state
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setLoading(false); // Stop loading in case of error
      });
  }, []); // Empty dependency array to only run once when the component mounts

  // Filter reviews based on search query
  const filteredReviews = reviews.filter((review) =>
    review.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle input changes for the new review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate input fields
    if (!newReview.destination || !newReview.rating || !newReview.comment) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Reset messages
    setErrorMessage('');
    setSuccessMessage('');

    // Get the JWT token from local storage or context
    const token = Cookies.get('jwt'); // Adjust this based on how you store the token
    console.log("aaa",token);
    // Send the POST request to add a new review
    fetch('http://127.0.0.1:5000/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token
      },
      body: JSON.stringify({
        ...newReview,
        // Assuming you want to include the image_url from the user context or state
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
        setReviews([...reviews, data]); // Add the new review to the list
        setSuccessMessage('Review added successfully!');
        setNewReview({ destination: '', rating: '', comment: '' }); // Reset the form
        setShowForm(false); // Hide the form
      })
      .catch((error) => {
        console.error('Error adding review:', error);
        setErrorMessage(error.message || 'Error adding review. Please try again.');
      });
  };

  return (
    <div className="Destinationpage">
      <section id="review-section" className="reviews">
      <div className="search-container">
          <input
            type="text"
            placeholder="Search for a review by destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

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
          <button
            className="cta-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : 'Add Your Review'}
          </button>
        </div>

        <h1>Reviews</h1>
        {loading ? (
          <div className="spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-info">
                  <h1>{review.destination.toUpperCase()}</h1>
                  <p><strong>Rating:</strong> {review.rating}/5</p>
                  <p><strong>Comment:</strong> {review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews found.</p>
        )}
      </section>
    </div>
  );
};

export default ReviewPage;