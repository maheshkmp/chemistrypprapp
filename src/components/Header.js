import React from 'react';
import { Link } from 'react-router-dom';

function Header({ title, showLoginOptions = false }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      {showLoginOptions && (
        <div className="auth-links">
          <Link to="/login" className="auth-link">LOGIN</Link>
          <Link to="/register" className="auth-link">REGISTER</Link>
        </div>
      )}
    </header>
  );
}

export default Header;