import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css'; // Import your CSS file for styling
import destination from './eco-tourism.png';
import hneya from './hneya.jpg';
import jellyfish from './jellyfish.jpg';
import group from './people.png';
import review from './rating.png';
import sahara from './sahara.jpg';
import activity from './tent.png';
const HomePage = () => {
  const services = [
    { id: 1, title: 'Destinations', description: 'Explore and choose your perfect getaway in Tunisia.', src: destination, route: '/destinations' },
    { id: 2, title: 'Activities', description: 'Discover exciting eco-friendly activities that let you connect with nature.', src: activity, route: '/activities' },
    { id: 3, title: 'Travel Groups', description: 'Pick your companions and create unforgettable memories.', src: group, route: '/travel-groups' },
    { id: 4, title: 'Reviews', description: 'Share your amazing travel experiences with us.', src: review, route: '/reviews' },
  ];

  const [backgroundImage, setBackgroundImage] = useState(hneya); // Initial background image
  const [isFading, setIsFading] = useState(false); // Track fade-out status
  const navigate = useNavigate();

   // Array of images

  useEffect(() => {
    const images = [hneya, jellyfish, sahara];
    const interval = setInterval(() => {
      setIsFading(true); // Trigger fade-out effect
      setTimeout(() => {
        setBackgroundImage((prev) => {
          const currentIndex = images.indexOf(prev);
          return images[(currentIndex + 1) % images.length]; // Cycle through images
        });
        setIsFading(false); // End the fade-out effect
      }, 1000); // Wait for 1 second (duration of the fade-out) before switching the image
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleServiceClick = (serviceRoute) => {
    navigate(serviceRoute); // Navigate to the desired route
  };

  return (
    <div className="homepage">
      <header
        className={`header ${isFading ? 'fade-out' : ''}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1>Welcome to Our Website!</h1>
        <p>Your one-stop solution for all your digital needs.</p>
        <a href="#services-section" ><button className="cta-button">Get Started</button></a>
      </header>

      <section id="services-section" className="services">
        <h2>Our Services</h2>
        <div className="services-list">
          {services.map((service) => (
            <div key={service.id} className="service-item" onClick={() => handleServiceClick(service.route)}>
              <div className="step_img">
                <img src={service.src} alt="" />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
