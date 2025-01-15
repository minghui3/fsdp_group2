// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestCaseManagement from './pages/TestCaseManagement';
import AddProject from './pages/AddProject';
import Authentication from './components/Authentication';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Authentication><Dashboard /></Authentication>} />
        <Route path='/test-case-management' element={<TestCaseManagement />} />
        <Route path="/add-project" element={<AddProject />} />
      </Routes>
    </Router>
  );
};

export default App;