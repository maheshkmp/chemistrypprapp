import React, { useState } from 'react';
import './PaperForm.css';

const PaperForm = ({ paper, onSubmit, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: paper?.title || '',
    description: paper?.description || '',
    duration_minutes: paper?.duration_minutes || 120,
    total_marks: paper?.total_marks || 100
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save paper');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="paper-form">
      <h2>{mode === 'create' ? 'Create New Paper' : 'Edit Paper'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Duration (minutes):</label>
        <input
          type="number"
          name="duration_minutes"
          value={formData.duration_minutes}
          onChange={handleChange}
          required
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Total Marks:</label>
        <input
          type="number"
          name="total_marks"
          value={formData.total_marks}
          onChange={handleChange}
          required
          min="1"
        />
      </div>

      <button type="submit" className="submit-btn">
        {mode === 'create' ? 'Create Paper' : 'Update Paper'}
      </button>
    </form>
  );
};

export default PaperForm;