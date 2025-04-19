import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="page home-page">
      <Header title="NAME" />
      <div className="content">
        <div className="analytics-section">
          <h2>YOUR ANALYTICS HERE</h2>
          <div className="red-circle"></div>
        </div>
        <div className="actions">
          <Link to="/analytics" className="button">SHOW ANALYTICS</Link>
          <Link to="/papers" className="button">FIND NEXT PAPER</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;