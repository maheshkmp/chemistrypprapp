import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function FinalizePaper() {
  const [score, setScore] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would handle the API call to submit the score
    try {
      // const response = await fetch('/api/submit-score', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ score })
      // });
      
      // if (response.ok) {
        navigate('/');
      // }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  return (
    <div className="page finalize-page">
      <Header title="FINALIZING THE PAPER" />
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="score">ENTER YOUR SCORE</label>
            <input 
              type="number" 
              id="score" 
              value={score} 
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button submit-button">SUBMIT AND FINISH</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default FinalizePaper;