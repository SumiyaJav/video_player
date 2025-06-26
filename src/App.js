// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateVideo from './pages/CreateVideo';
import VideoPlayer from './pages/VideoPlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateVideo />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
