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
  const [time, setTime] = useState(7200); // 2 hours in seconds
  const [timerActive, setTimerActive] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  // Add this to your existing useEffect or create a new one
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
  
    if (token) {
      fetchUserData();
    }
  }, [token]);
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
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    navigate('/papers');
  };

  return (
    <div className="timed-paper">
      <div className="paper-header">
        <div className="timer">{formatTime(time)}</div>
        {!showPaper ? (
          <button onClick={handleShowPaper} className="show-paper-btn">
            Show Paper
          </button>
        ) : (
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
    </div>
  );
};

export default TimedPaper;