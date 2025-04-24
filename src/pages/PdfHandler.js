import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PdfHandler.css';  // Add this line

const PdfHandler = ({ isAdmin }) => {
  const { paperId } = useParams();
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setUploadStatus('Uploading...');
      
      // Get token and verify it exists
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token); // Debug token
      
      if (!token) {
        setError('Not authenticated. Please login first.');
        return;
      }

      const response = await axios.post(`http://localhost:8000/papers/${paperId}/upload-pdf`, 
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log('Upload response:', response); // Debug response
      setUploadStatus('Upload successful!');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Error uploading file');
      setUploadStatus('');
    }
  };
  
  return (
    <div className="pdf-handler">
      <h2>Paper PDF</h2>
      
      <div className="pdf-viewer">
        <a 
          href={`http://localhost:8000/papers/${paperId}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          View PDF
        </a>
      </div>
      
      {isAdmin && (
        <div className="pdf-uploader">
          <h3>Upload PDF</h3>
          {error && <div className="error-message">{error}</div>}
          {uploadStatus && <div className="status-message">{uploadStatus}</div>}
          
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="pdf-file">Select PDF:</label>
              <input 
                type="file" 
                id="pdf-file" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={!file}
            >
              Upload PDF
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PdfHandler;