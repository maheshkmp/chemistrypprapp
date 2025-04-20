import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import PaperList from './pages/PaperList';
import TimedPaper from './pages/TimedPaper';
import FinalizePaper from './pages/FinalizePaper';
import AnswerCheck from './pages/AnswerCheck';
import Login from './pages/Login';
import Register from './pages/Register';
import PaperManagePage from './pages/PaperManagePage'; // New component

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/papers" element={<PaperList />} />
            <Route path="/papers/:paperId" element={<TimedPaper />} />
            <Route path="/papers/:paperId/manage" element={<PaperManagePage />} /> {/* New route */}
            <Route path="/papers/:paperId/finalize" element={<FinalizePaper />} />
            <Route path="/papers/:paperId/check" element={<AnswerCheck />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;