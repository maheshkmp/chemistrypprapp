import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Check if token exists but isAuthenticated is false
    if (token && !isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [token, isAuthenticated]);

  const handleViewPapers = () => {
    if (isAuthenticated && token) {
      navigate('/papers');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Chemistry Partner</h1>
        {isAuthenticated && username ? (
          <p>Welcome back, {username}!</p>
        ) : (
          <p>Your comprehensive platform for chemistry practice papers</p>
        )}
        <button onClick={handleViewPapers} className="cta-button">
          {isAuthenticated ? 'View Papers' : 'Login to View Papers'}
        </button>
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Practice Papers</h3>
            <p>Access a wide range of chemistry practice papers</p>
          </div>
          <div className="feature-card">
            <h3>Timed Tests</h3>
            <p>Test yourself under exam conditions</p>
          </div>
          <div className="feature-card">
            <h3>Instant Feedback</h3>
            <p>Get immediate results and explanations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;