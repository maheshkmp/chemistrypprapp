import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Profile.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const [submissions, setSubmissions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, submissionsResponse] = await Promise.all([
          axios.get('http://localhost:8000/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/papers/submissions/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setUserData(userResponse.data);
        setSubmissions(submissionsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const chartData = {
    labels: submissions.map((_, index) => `Paper ${index + 1}`),
    datasets: [{
      label: 'Marks',
      data: submissions.map(sub => sub.marks),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true,
        text: 'Performance Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Marks'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Papers'
        }
      }
    }
  };

  return (
    <div className="profile-container">
      {/* Profile header section */}
      <div className="profile-header">
        <h1>Profile: {userData?.username}</h1>
        <div className="header-buttons">
          <button onClick={() => navigate('/papers')} className="papers-btn">
            Back to Papers
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Analytics section */}
      <div className="analytics-section">
        <h2>Performance Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Papers</h3>
            <p>{submissions.length}</p>
          </div>
          <div className="analytics-card">
            <h3>Average Score</h3>
            <p>
              {submissions.length > 0
                ? (submissions.reduce((acc, sub) => acc + sub.marks, 0) / submissions.length).toFixed(2)
                : 0}%
            </p>
          </div>
          <div className="analytics-card">
            <h3>Best Score</h3>
            <p>
              {submissions.length > 0
                ? Math.max(...submissions.map(sub => sub.marks))
                : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Progress Chart</h2>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Profile;