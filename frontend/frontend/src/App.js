import { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './/pages/auth/ProtectedRoute';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ActivityItem from './pages/activities/ActivityItem';
import ActivityPage from './pages/activities/ActivityPage';
import { RefreshProvider } from './pages/auth/RefreshContext'; // Import the RefreshProvider
import { UserContext, UserProvider } from './pages/auth/UserProvider';
import DestinationItem from './pages/destinations/DestinationItem';
import DestinationPage from './pages/destinations/DestinationPage';
import GroupItem from './pages/groups/GroupItem';
import GroupPage from './pages/groups/GroupPage';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login+signup/LoginPage';
import SignupPage from './pages/login+signup/SignupPage';
import NOtFoundPage from './pages/NOtFoundPage';
import UserItem from './pages/profile/UserItem';
import ReviewPage from './pages/reviews/ReviewPage';
import './styles/App.css';

function App() {
  const { logout } = useContext(UserContext);
  
  return (
    <UserProvider>
    <RefreshProvider >
      <Router>
        <div className="App">
          <div className="content-wrap">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={<HomePage />} />
              <Route
                path="/destinations"
                element={<ProtectedRoute><DestinationPage /></ProtectedRoute>} />
              <Route
                path="/destinations/:name"
                element={<ProtectedRoute><DestinationItem /></ProtectedRoute>} />
              <Route
                path="/activities"
                element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
              <Route
                path="/activities/:name"
                element={<ProtectedRoute><ActivityItem /></ProtectedRoute>} />
              <Route
                path="/travel-groups"
                element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
              <Route
                path="/travel-groups/:group_name"
                element={<ProtectedRoute><GroupItem /></ProtectedRoute>} />
              <Route
                path="/users/:username"
                element={<ProtectedRoute><UserItem onLogout={logout} component={ReviewPage}/></ProtectedRoute>} />
              <Route
                path="/reviews"
                element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
              <Route
                path="/contact"
                element={<ProtectedRoute><h1 style={{ fontFamily: 'Source Serif Pro', color: '#175919' }}>Our Contact:</h1></ProtectedRoute>} />
              <Route path="*" element={<NOtFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </RefreshProvider></UserProvider>
  );
};

export default App;