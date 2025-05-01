import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TimedPaper.css';

const TimedPaper = () => {
  const { paperId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaper, setShowPaper] = useState(false);
  const [time, setTime] = useState(7200);
  const [timerActive, setTimerActive] = useState(false);
  const [paperName, setPaperName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marks, setMarks] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timerActive && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, time]);

  const handleShowPaper = async () => {
    setLoading(true);
    try {
      const paperDetails = await axios.get(`http://localhost:8000/papers/${paperId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPaperName(paperDetails.data.name || 'Paper');
  
      const response = await axios.get(`http://localhost:8000/papers/${paperId}/pdf`, {
        params: { token },
        responseType: 'blob'
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setShowPaper(true);
      setTimerActive(true);
    } catch (err) {
      setError('Failed to load PDF');
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndPaper = () => {
    setShowPaper(false);
    setTimerActive(false);
    setTimeSpent(7200 - time);
    setIsSubmitting(true);
  };

  const handleSubmit = async () => {
    if (!marks || marks === '') {
      setSubmitError('Please enter your marks before submitting');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/papers/${paperId}/submit`,
        {
          time_spent: timeSpent,
          marks: parseInt(marks)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      navigate('/profile');
    } catch (err) {
      setSubmitError('Failed to submit paper');
    }
  };

  // Remove handleDeletePaper function since it's not being used
  
  if (loading) return <div className="loading">Loading paper...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="timed-paper">
      <div className="paper-header">
        <div className="timer">{formatTime(time)}</div>
        {!showPaper && !isSubmitting && (
          <button onClick={handleShowPaper} className="show-paper-btn">
            Show Paper
          </button>
        )}
        {showPaper && !isSubmitting && (
          <button onClick={handleEndPaper} className="end-paper-btn">
            End Paper
          </button>
        )}
      </div>
      
      {showPaper && (
        <div className="pdf-viewer">
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        </div>
      )}

      {/* Submission form section */}
      {isSubmitting && (
        <div className="submission-form">
          <h2>{paperName} Submission</h2>
          <div className="time-spent">
            Time Spent: <span>{formatTime(timeSpent)}</span>
          </div>
          {submitError && <div className="error-message">{submitError}</div>}
          <div className="form-group">
            <label>Marks:</label>
            <input
              type="number"
              value={marks}
              onChange={(e) => {
                setMarks(e.target.value);
                setSubmitError('');
              }}
              min="0"
              max="100"
              required
            />
          </div>
          <button onClick={handleSubmit} className="submit-btn">
            Submit Paper
          </button>
        </div>
      )}
    </div>
  );
};

export default TimedPaper;