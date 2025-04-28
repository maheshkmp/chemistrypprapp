import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PaperList.css';

const PaperList = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/papers/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPapers(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
        setError('Failed to fetch papers');
        setLoading(false);
      }
    };

    if (!token) {
      navigate('/login');
    } else {
      fetchPapers();
    }
  }, [token, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="paper-list">
      <div className="paper-list-header">
        <h1>Available Papers</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="papers-grid">
        {papers.map(paper => (
          <div key={paper.id} className="paper-card">
            <h2>{paper.title}</h2>
            <p>{paper.description}</p>
            <button onClick={() => navigate(`/papers/${paper.id}`)}>
              Start Paper
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperList;