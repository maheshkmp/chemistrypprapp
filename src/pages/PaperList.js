import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaperList = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        setUser({ is_admin: isAdminUser });
        
        const papersResponse = await axios.get('http://localhost:8000/papers', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
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
  }, [navigate]);

  const handleCreatePaper = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:8000/papers/', 
        {
          title: "New Paper",
          description: "Paper description",
          duration_minutes: 60,
          total_marks: 100
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      navigate(`/papers/${response.data.id}/manage`);
    } catch (error) {
      console.error('Error creating paper:', error);
      setError('Failed to create paper. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading papers...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Remove the second handleCreatePaper function that was here

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
                    href={`http://localhost:8000/papers/${paper.id}/pdf?token=${localStorage.getItem('accessToken')}`}
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
          <button onClick={handleCreatePaper} className="btn btn-primary">
            Create New Paper
          </button>
        </div>
      )}
    </div>
  );
};

export default PaperList;