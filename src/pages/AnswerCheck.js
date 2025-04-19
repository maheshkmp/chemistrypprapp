import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AnswerCheck() {
  const [showAnswers, setShowAnswers] = useState(false);
  
  return (
    <div className="page answer-check-page">
      <Header title="LET'S FIND YOUR ANSWERS RIGHT OR WRONG" />
      <div className="content">
        <button 
          className="button"
          onClick={() => setShowAnswers(!showAnswers)}
        >
          SHOW ANSWER SHEET
        </button>
        
        {showAnswers && (
          <div className="answer-sheet">
            {/* Answer sheet content would go here */}
            <p>Your answer sheet will be displayed here.</p>
          </div>
        )}
        
        <Link to="/" className="button ok-button">OKAY</Link>
      </div>
      <Footer />
    </div>
  );
}

export default AnswerCheck;