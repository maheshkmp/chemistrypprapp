import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <Link to="/privacy" className="privacy-policy">PRIVACY POLICY</Link>
    </footer>
  );
}

export default Footer;