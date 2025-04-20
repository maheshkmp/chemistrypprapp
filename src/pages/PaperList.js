import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PaperList = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user info to check if admin
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userResponse = await axios.get('http://localhost:8000/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setUser(userResponse.data);
        }
        
        // Get papers list
        const papersResponse = await axios.get('http://localhost:8000/papers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setPapers(papersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load papers. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading papers...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="paper-list">
      <h1>Available Papers</h1>
      
      {papers.length === 0 ? (
        <p>No papers available at the moment.</p>
      ) : (
        <div className="papers-grid">
          {papers.map(paper => (
            <div key={paper.id} className="paper-card">
              <h2>{paper.title}</h2>
              <p className="paper-description">{paper.description}</p>
              <div className="paper-details">
                <p><strong>Duration:</strong> {paper.duration_minutes} minutes</p>
                <p><strong>Total Marks:</strong> {paper.total_marks}</p>
                <p><strong>PDF:</strong> {paper.pdf_path ? 'Available' : 'Not available'}</p>
              </div>
              <div className="paper-actions">
                {paper.pdf_path && (
                  <a 
                    href={`http://localhost:8000/papers/${paper.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View PDF
                  </a>
                )}
                <Link to={`/papers/${paper.id}`} className="btn btn-primary">
                  Start Paper
                </Link>
                {user?.is_admin && (
                  <Link to={`/papers/${paper.id}/manage`} className="btn btn-outline">
                    Manage
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {user?.is_admin && (
        <div className="admin-actions">
          <Link to="/papers/create" className="btn btn-success">
            Create New Paper
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaperList;