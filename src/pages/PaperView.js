import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaperViewer from '../components/PaperViewer';
import './PaperView.css';

const PaperView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`http://localhost:8000/papers/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPaper(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPaper();
  }, [id, token]);

  return (
    <div className="paper-view">
      {paper ? (
        <>
          <h1>{paper.title}</h1>
          <div className="paper-details">
            <p><strong>Authors:</strong> {paper.authors}</p>
            <p><strong>Publication Date:</strong> {paper.publication_date}</p>
            <PaperViewer paperId={id} token={token} />
          </div>
        </>
      ) : (
        <p>Loading paper...</p>
      )}
    </div>
  );
};

export default PaperView;