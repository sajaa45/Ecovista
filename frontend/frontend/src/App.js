import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ActivityItem from './pages/activities/ActivityItem';
import ActivityPage from './pages/activities/ActivityPage';
import DestinationItem from './pages/destinations/DestinationItem';
import DestinationPage from './pages/destinations/DestinationPage';
import GroupItem from './pages/groups/GroupItem';
import GroupPage from './pages/groups/GroupPage';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login+signup/LoginPage';
import SignupPage from './pages/login+signup/SignupPage';
import NotFound from './pages/NOtFoundPage';
import './styles/App.css';
function App() {
  return (
    <Router>
      <div className="App">
        <div class="content-wrap">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationPage />} />
            <Route path="/destinations/:name" element={<DestinationItem />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/activity/:name" element={<ActivityItem />} />
            <Route path="/travel-group" element={<GroupPage />} />
            <Route path="/travel-group/:group_name" element={<GroupItem />} />
            <Route path="/contact" element={<h1 style={{ "fontFamily": "Source Serif Pro", "color": "#175919" }}>Our Contact:</h1>} />
            
            {/* Add other routes here */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
