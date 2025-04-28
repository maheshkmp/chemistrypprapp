import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">Chemistry Partner</div>
      <div className="nav-items">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">Welcome, {username}</span>
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-button">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;