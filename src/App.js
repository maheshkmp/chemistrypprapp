import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PaperList from './pages/PaperList';
import PaperView from './pages/PaperView';
import FinalizePaper from './pages/FinalizePaper';
import AnswerCheck from './pages/AnswerCheck';
import TimedPaper from './pages/TimedPaper';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/papers" element={<PaperList />} />
          <Route path="/papers/:id" element={<PaperView />} />
          <Route path="/finalize" element={<FinalizePaper />} />
          <Route path="/answers" element={<AnswerCheck />} />
          <Route path="/timed" element={<TimedPaper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;