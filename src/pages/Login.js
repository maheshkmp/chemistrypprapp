import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would handle the API call to login
    try {
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // if (response.ok) {
        navigate('/');
      // }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="page login-page">
      <Header title="CHEMISTRY PARTNER" showLoginOptions={true} />
      <div className="content">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-field">
            <label htmlFor="username">Username</label>
            <input 
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="button login-button">ENTER</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;