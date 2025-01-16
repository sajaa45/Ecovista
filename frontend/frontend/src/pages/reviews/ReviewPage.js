import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]); // State to store fetched reviews
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(true); // State to handle loading state
  const navigate = useNavigate();

  // Fetch reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      const token = Cookies.get('jwt');
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/review', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization with token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data); // Set reviews in state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews(); // Call the function to fetch reviews
  }, [navigate]);

  // Filter reviews based on search query
  const filteredReviews = reviews.filter((review) =>
    review.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleServiceClick = (route) => {
    navigate(`/users/${route}`);}
  return (
    <div className="Destinationpage">
      <section id="review-section" className="reviews">
        <div className="search-containerr">
          <input
            type="text"
            placeholder="Search for a review by destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-inputt"
          />
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
                <div className="review-header">
                  {/* Display the user image and username */}
                  <img
                    src={review.image_url || 'default_image_url_here'}
                    alt={review.username}
                    className="user-image"
                  /><span
                  onClick={() => handleServiceClick(review.username)}
                  className="member-name"
                >
                  <p className="username">{review.username}</p></span>
                </div>
                <div className="review-info">
                  <h1>
                    <span
                      className="clickable-destination"
                      onClick={() => navigate(`/destinations/${review.destination.toLowerCase()}`)}
                    >
                      {review.destination.toUpperCase()}
                    </span>
                  </h1>
                  <p><strong>Destination ID:</strong> {review.destination_id}</p>
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
