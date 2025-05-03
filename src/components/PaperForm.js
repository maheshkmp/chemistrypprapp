import React, { useState } from 'react';
import './PaperForm.css';

const PaperForm = ({ paper, onSubmit, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: paper?.title || '',
    description: paper?.description || '',
    duration_minutes: paper?.duration_minutes || 120,
    total_marks: paper?.total_marks || 100
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setPdfFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formDataWithFile = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataWithFile.append(key, formData[key]);
    });
    
    if (pdfFile) {
      formDataWithFile.append('pdf_file', pdfFile);
    }

    try {
      await onSubmit(formDataWithFile);
    } catch (err) {
      setError(err.message || 'Failed to save paper');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      title: '',
      description: '',
      duration_minutes: 120,
      total_marks: 100
    });
    setPdfFile(null);
    setError('');
    
    // Only call onCancel if it exists
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
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

      <div className="form-group">
        <label>PDF File:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
          disabled={isSubmitting}
        />
        {pdfFile && (
          <div className="file-info">
            Selected file: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)}MB)
          </div>
        )}
      </div>

      <div className="button-group">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Saving...' 
            : mode === 'create' ? 'Create Paper' : 'Update Paper'
          }
        </button>
        <button 
          type="button"
          className="cancel-btn" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PaperForm;