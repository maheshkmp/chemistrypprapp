import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PaperForm from '../components/PaperForm';
import './PaperList.css';

const PaperList = () => {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchPapers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/papers/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPapers(response.data);
      setIsLoading(false);
    } catch (err) {
      setErrorMessage('Failed to fetch papers');
      setIsLoading(false);
    }
  }, [token]); // Add token as dependency

  // Add handleDeletePaper function
  const handleDeletePaper = async (paperId) => {
    try {
      await axios.delete(`http://localhost:8000/papers/${paperId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPapers();
    } catch (err) {
      console.error('Failed to delete paper:', err);
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsAdmin(response.data.is_admin || false);
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    };

    if (!token) {
      navigate('/login');
    } else {
      checkAdminStatus();
      fetchPapers();
    }
  }, [token, navigate, fetchPapers]); // Add fetchPapers to dependency array

  const handleCreatePaper = async (formData) => {
    try {
      await axios.post('http://localhost:8000/papers/', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowForm(false);
      fetchPapers();
    } catch (err) {
      console.error('Failed to create paper:', err);
    }
  };

  const handleUpdatePaper = async (formData) => {
    try {
      await axios.put(`http://localhost:8000/papers/${editingPaper.id}`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditingPaper(null);
      fetchPapers();
    } catch (err) {
      console.error('Failed to update paper:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (errorMessage) return <div className="error-message">{errorMessage}</div>;

  return (
    <div className="paper-list">
      <div className="paper-list-header">
        <h1>Available Papers</h1>
        <div className="header-buttons">
          {isAdmin && (
            <button 
              onClick={() => setShowForm(true)}
              className="create-btn"
            >
              Create Paper
            </button>
          )}
          <button 
            className="profile-btn"
            onClick={() => navigate('/profile')}
          >
            My Profile
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <PaperForm 
          onSubmit={handleCreatePaper}
          onCancel={() => setShowForm(false)}
          mode="create"
        />
      )}

      {editingPaper && (
        <PaperForm 
          paper={editingPaper}
          onSubmit={handleUpdatePaper}
          onCancel={() => setEditingPaper(null)}
          mode="edit"
        />
      )}

      <div className="papers-grid">
        {papers.map(paper => (
          <div key={paper.id} className="paper-item">
            <h3>{paper.title}</h3>
            <p>{paper.description}</p>
            <div className="paper-actions">
              <button onClick={() => navigate(`/papers/${paper.id}`)}>
                Start Paper
              </button>
              {isAdmin && (
                <>
                  <button 
                    onClick={() => setEditingPaper(paper)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePaper(paper.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperList;