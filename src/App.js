import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubmittalPage from './pages/SubmittalPage';
import FlowchartPage from './pages/FlowchartPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/submittal/:projectId" element={<SubmittalPage />} />
        <Route path="/flowchart/:projectId" element={<FlowchartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
