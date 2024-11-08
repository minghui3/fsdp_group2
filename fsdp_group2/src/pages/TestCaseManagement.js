// src/pages/TaskCaseManagement.js
import React from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import TestCaseSummary from '../components/TestCaseSummary';
import RecentActivity from '../components/RecentActivity'; // Import RecentActivity
import '../style/testCaseManagement.css'; // Import the CSS file

const TestCaseManagement = () => {


  return (
    <div className='testCaseManagement-layout'>
      <Sidebar />
      <div className='testCaseManagement-container'>
        <Navbar />
        {/* Test Case Summary Component */}
        <TestCaseSummary />
        {/* Recent Activity Component */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default TestCaseManagement;