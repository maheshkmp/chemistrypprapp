import React, { useState, useEffect } from 'react';
import PaperForm from './PaperForm';
import './PaperList.css';
import { useNavigate } from 'react-router-dom';

const PaperList = () => {
  const [showForm, setShowForm] = useState(false);
  const [papers, setPapers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handleEditClick = (paper) => {
    setSelectedPaper(paper);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setSelectedPaper(null);
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
  
      const response = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      throw error;
    }
  };
  
  const fetchWithAuth = async (url, options = {}) => {
    try {
      let token = localStorage.getItem('token');
      if (!token) throw new Error('No token available');
  
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 401) {
        token = await refreshToken();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
  
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };
  
  // Remove the duplicate fetchPapers and keep this improved version:
  const fetchPapers = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:8000/api/papers/');
      
      if (response.status === 403) {
        alert('Admin privileges required');
        return;
      }
  
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Failed to fetch papers:', error);
      if (error.message.includes('Admin privileges') || error.response?.status === 403) {
        alert('Admin access required to view papers');
      }
    }
  };
  
  // Improve handleUpdatePaper error handling:
  const handleUpdatePaper = async (formData) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/papers/${selectedPaper.id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Update failed with status ${response.status}`);
      }
      
      setIsEditing(false);
      setSelectedPaper(null);
      fetchPapers();
    } catch (error) {
      console.error('Failed to update paper:', error);
      alert(error.message || 'Failed to update paper');
    }
  };

  const fetchPapersWithAdminCheck = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // First check admin status
      const adminCheck = await fetch('http://localhost:8000/api/auth/check-admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!adminCheck.ok) {
        if (adminCheck.status === 403) {
          alert('Admin privileges required');
          return;
        }
        throw new Error('Failed to verify admin status');
      }

      const response = await fetch('http://localhost:8000/api/papers/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login', { state: { from: 'paperlist' } });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Failed to fetch papers:', error);
      if (error.message.includes('Admin privileges')) {
        alert('Admin access required to view papers');
      }
    }
  };

  // Add this to handle initial auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: 'paperlist' } });
    } else {
      fetchPapers();
    }
  }, [navigate]);

  const handleCreatePaper = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/papers/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        await fetchPapers();
        setShowForm(false);  // Close the form after successful submission
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create paper');
      }
    } catch (error) {
      console.error('Error creating paper:', error);
      alert(error.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedPaper(null);
    setIsEditing(false);
  };

  return (
    <div className="paper-list">
      <button onClick={() => setShowForm(true)} className="add-paper-btn">
        Add New Paper
      </button>

      {/* Show create form */}
      {showForm && (
          <PaperForm
            onCancel={() => setShowForm(false)}  // Make sure this is properly defined
            onSubmit={handleCreatePaper}
            mode="create"
          />
      )}

      {/* Show edit form */}
      {isEditing && selectedPaper && (
        <PaperForm
          paper={selectedPaper}
          onCancel={handleFormCancel}
          onSubmit={handleUpdatePaper}
          mode="edit"
        />
      )}

      <div className="papers-grid">
        {papers.map(paper => (
          <div key={paper.id} className="paper-card">
            <h3>{paper.title}</h3>
            <p className="description">{paper.description}</p>
            <div className="paper-meta">
              <span>Duration: {paper.duration_minutes} mins</span>
              <span>Marks: {paper.total_marks}</span>
            </div>
            <div className="paper-actions">
              <button className="edit-btn" onClick={() => handleEditClick(paper)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperList;