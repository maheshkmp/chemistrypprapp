import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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
import './UserProfile.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserProfile = () => {
  const [submissions, setSubmissions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8000/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserData(userResponse.data);

        const submissionsResponse = await axios.get('http://localhost:8000/papers/submissions/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSubmissions(submissionsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const chartData = {
    labels: submissions.map((_, index) => `Paper ${index + 1}`),
    datasets: [
      {
        label: 'Marks',
        data: submissions.map(sub => sub.marks),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const calculateAnalytics = () => {
    if (submissions.length === 0) return { avg: 0, highest: 0, lowest: 0 };
    const marks = submissions.map(sub => sub.marks);
    return {
      avg: (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2),
      highest: Math.max(...marks),
      lowest: Math.min(...marks)
    };
  };

  const analytics = calculateAnalytics();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile: {userData?.username}</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="analytics-section">
        <h2>Performance Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Average Score</h3>
            <p>{analytics.avg}%</p>
          </div>
          <div className="analytics-card">
            <h3>Highest Score</h3>
            <p>{analytics.highest}%</p>
          </div>
          <div className="analytics-card">
            <h3>Lowest Score</h3>
            <p>{analytics.lowest}%</p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Progress Chart</h2>
        <div className="chart-container">
          <Line data={chartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Performance Over Time' }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;