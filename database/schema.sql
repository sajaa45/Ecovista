
-- Table for Destinations
create TABLE Destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Use INT for MySQL
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    activities TEXT,
    image_url VARCHAR(255)
);

-- Table for Users
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Use INT for MySQL
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Store hashed passwords
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin'))  -- Role can be user or admin
);

-- Table for Bookings
CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Use INT for MySQL
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('confirmed', 'canceled', 'pending')),  -- Status of the booking
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES Destinations(id) ON DELETE CASCADE
);

-- Table for Reviews
CREATE TABLE Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Use INT for MySQL
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),  -- Rating between 1 and 5
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES Destinations(id) ON DELETE CASCADE
);
SHOW TABLES;
