import { useState } from 'react';
import './PaperViewer.css';

const PaperViewer = ({ paperId, token }) => {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <div className="paper-viewer">
      <button 
        className="view-button"
        onClick={() => setShowPdf(!showPdf)}
      >
        {showPdf ? 'Hide Paper' : 'Show Paper'}
      </button>
      
      {showPdf && (
        <div className="pdf-container">
          <object
            data={`http://localhost:8000/papers/${paperId}/pdf?token=${token}`}
            type="application/pdf"
            width="100%"
            height="800px"
          >
            <p>Your browser doesn't support embedded PDFs.</p>
          </object>
        </div>
      )}
    </div>
  );
};

export default PaperViewer;