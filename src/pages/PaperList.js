import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function PaperList() {
  // Simulated paper data - would come from API in real app
  const papers = [
    { id: 1, title: 'Paper 1' },
    { id: 2, title: 'Paper 2' },
    { id: 3, title: 'Paper 3' },
  ];

  return (
    <div className="page paper-list-page">
      <Header title="PAPER LIST" showLoginOptions={true} />
      <div className="content">
        <div className="papers-container">
          {papers.map(paper => (
            <div className="paper-item" key={paper.id}>
              <div className="paper-icon"></div>
              <Link to={`/papers/${paper.id}`} className="paper-title">{paper.title}</Link>
              <button className="buy-button">BUY</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaperList;