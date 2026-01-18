-- Initialize the ecovista database with all required tables

USE ecovista;

-- Table for Users
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    image_url VARCHAR(255)
);

-- Table for Destinations
CREATE TABLE IF NOT EXISTS Destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url VARCHAR(255),
    creator_id INT NOT NULL,
    activities JSON NOT NULL
);

-- Table for Activities
CREATE TABLE IF NOT EXISTS Activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    creator_id INT NOT NULL,
    max_participants INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    destinations JSON NOT NULL
);

-- Table for TravelGroups
CREATE TABLE IF NOT EXISTS TravelGroups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255) UNIQUE NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    contact_info VARCHAR(255) NOT NULL,
    creator_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    members JSON NOT NULL
);

-- Table for Reviews
CREATE TABLE IF NOT EXISTS Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    image_url VARCHAR(255),
    destination_id INT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
