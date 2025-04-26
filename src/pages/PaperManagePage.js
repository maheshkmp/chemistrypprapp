import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PdfHandler from './PdfHandler';

const PaperManagePage = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 0,
    total_marks: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        
        if (!token || !isAdminUser) {
          navigate('/login');
          return;
        }
        
        setIsAdmin(true);
        
        // Fetch paper details
        const paperResponse = await axios.get(`http://localhost:8000/papers/${paperId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setPaper(paperResponse.data);
        setFormData({
          title: paperResponse.data.title,
          description: paperResponse.data.description,
          duration_minutes: paperResponse.data.duration_minutes,
          total_marks: paperResponse.data.total_marks
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load paper details');
        setLoading(false);
      }
    };

    checkAuth();
  }, [paperId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('minutes') || name.includes('marks') ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      
      // Convert numeric strings to integers
      const updatedData = {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes),
        total_marks: parseInt(formData.total_marks)
      };

      await axios.put(  // Changed back to PUT since PATCH didn't work
        `http://localhost:8000/papers/${paperId}`,
        updatedData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      alert('Paper updated successfully');
      
      // Refresh paper data
      const paperResponse = await axios.get(`http://localhost:8000/papers/${paperId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setPaper(paperResponse.data);
    } catch (error) {
      console.error('Update error:', error);
      setError('Failed to update paper');
    }
  };

  if (loading) return <div className="loading">Loading paper details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!isAdmin) return <div className="error-message">Unauthorized access</div>;

  return (
    <div className="paper-manage-page">
      <h1>Manage Paper: {paper.title}</h1>
      
      <div className="paper-form-section">
        <h2>Paper Details</h2>
        <form onSubmit={handleSubmit} className="paper-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="duration_minutes">Duration (minutes):</label>
            <input
              type="number"
              id="duration_minutes"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="total_marks">Total Marks:</label>
            <input
              type="number"
              id="total_marks"
              name="total_marks"
              value={formData.total_marks}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Update Paper</button>
        </form>
      </div>
      
      <div className="pdf-section">
        <h2>PDF Management</h2>
        <PdfHandler isAdmin={isAdmin} />
      </div>
      
      <div className="questions-section">
        <h2>Questions</h2>
        {/* Question management UI would go here */}
        <p>Question management is not implemented in this example.</p>
      </div>
    </div>
  );
};

export default PaperManagePage;