import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NOtFoundPage';
import SignupPage from './pages/SignupPage';
import './styles/App.css';
function Home() {
  return <p>Welcome to the Home Page</p>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/sign-up" element={<SignupPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/" element={<Home />} />
          {/* Add other routes here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
