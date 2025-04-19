import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TimedPaper() {
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Convert seconds to hours and minutes
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  return (
    <div className="page timed-paper-page">
      <Header title="YOU HAVE 2 HOURS" />
      <div className="content">
        <div className="timer">COUNT: {timeString}</div>
        <div className="actions">
          <Link to="/paper-content" className="button">SHOW PAPER</Link>
          <Link to="/submit" className="button">SUBMIT</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TimedPaper;