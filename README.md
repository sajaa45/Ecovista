# Ecovista: A Web Services Platform for Sustainable Ecotourism

Ecovista is a cloud-native, microservices-based web platform designed to enhance ecotourism in Tunisia. It helps ecotourism enthusiasts discover destinations, participate in sustainable activities, and connect with travel groups. Users can also share reviews, fostering a community for eco-friendly travel.

## Features

* Eco-Friendly Destinations: A searchable database of eco-tourism destinations.
* Sustainable Activities: A curated list of eco-conscious activities for users to explore.
* Travel Groups: Tools to join or create travel groups for collaborative eco-tourism experiences.
* User Reviews: A system to share feedback and recommendations.
* Authentication and Authorization: Secure user login with JWT tokens and role-based access.

## Project Structure

1. **Introduction:**
   * Problem: Limited access to reliable platforms for discovering sustainable travel options in Tunisia.
   * Solution: Ecovista bridges the gap by integrating destinations, activities, travel groups, and reviews into a single platform.
2. **Utility:**
   * Purpose: Promote ecotourism while supporting environmental conservation and cultural preservation.
   * User Benefits: Secure authentication, destination exploration, activity planning, and community building.
3. **System Design:**
   * Architecture: Decomposed into 6 independent microservices (users, destinations, activities, travel groups, reviews, and gateway/auth), each independently deployable and scalable.
   * Database: Includes users, destinations, activities, travel groups, and reviews, with relational models for seamless integration.
   * API Endpoints:
      * User Management (e.g., signup, login, update, delete).
      * Destination Management (e.g., create, read, update, delete).
      * Activity Management (e.g., browse, manage).
      * Travel Group Management (e.g., join, create).
      * Reviews Management (e.g., add, browse).
4. **User Interface:**
   * Responsive design built with React for intuitive navigation.
   * Key Screens: Login/Signup, Dashboard, Destination/Activity Details, Travel Groups.

## Code Overview

* Frontend: Developed with React for a dynamic and engaging user experience.
* Backend: Decomposed into 6 independent RESTful microservices for efficient, scalable communication between frontend and backend.
* Authentication: Implements JSON Web Tokens (JWT) for secure login and session management.
* Database: Relational database (MySQL) to manage users, destinations, activities, and reviews.

## Deployment & Infrastructure

* **Containerization:** All services are Dockerized, with multi-container orchestration via Docker Compose for local development.
* **Orchestration:** Deployed on both standard Kubernetes (GKE/EKS/AKS-compatible manifests) and Red Hat OpenShift, supporting flexible, enterprise-grade deployment targets.
* **CI/CD:** Automated build pipeline using OpenShift Source-to-Image (S2I), building directly from Git commits.
* **Service Discovery:** Internal DNS-based service discovery between microservices.
* **Storage & Networking:** Persistent Volume Claims (PVCs) for stateful data, with automated HTTPS routing and SSL termination at the edge.

## Tools & Technologies

* **Languages & Frameworks:** Python (Flask), JavaScript (React)
* **Database & Storage:** MySQL, Kubernetes Persistent Volume Claims (PVCs)
* **Authentication:** JWT
* **Containerization & Cloud:** Docker, Docker Compose, Kubernetes, Red Hat OpenShift
* **CI/CD:** OpenShift Source-to-Image (S2I)
* **Design & Tools:** Figma, Visual Studio Code, Git
## Tools & Technologies


## Key Functionalities

1. **Eco-Friendly Destinations:**
   * Search and filter destinations.
   * View destination details, including activities and reviews.
2. **Sustainable Activities:**
   * Add, update, or delete activities for destinations.
   * Explore activities based on user preferences.
3. **Travel Groups:**
   * Create or join eco-friendly travel groups.
   * Collaborate and plan group trips.
4. **User Reviews:**
   * Share feedback on destinations.
   * Browse reviews from the community.

## Challenges & Future Enhancements

### Challenges

* Ensuring security and scalability across independently deployed microservices.
* Coordinating service discovery and networking consistently across Kubernetes and OpenShift environments.
* Creating a user-friendly yet feature-rich interface.

### Future Enhancements

* Real-Time Features: Introduce live chat and forums for better engagement.
* AI-Powered Recommendations: Suggest destinations and activities tailored to user preferences.
* Multilingual Support: Expand the platform's accessibility globally.
* Mobile App Development: Provide on-the-go access to all platform features.
* Observability: Add centralized logging and monitoring across microservices.
