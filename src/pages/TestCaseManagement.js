// src/pages/TestCaseManagement.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import ManualActivity from '../components/ManualActivity';
import RecentActivity from '../components/RecentActivity'; // Import RecentActivity
import '../style/testCaseManagement.css'; // Import the CSS file

const TestCaseManagement = () => {
  // State to track the active tab (auto or manual)
  const [activeTab, setActiveTab] = useState('auto'); // default is 'auto' tab

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="testCaseManagement-layout">
      <Sidebar />
      <div className="testCaseManagement-container">
        <Navbar />

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'auto' ? 'active' : ''}`}
            onClick={() => handleTabClick('auto')}
          >
            Auto Test Cases
          </button>
          <button
            className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => handleTabClick('manual')}
          >
            Manual Test Cases
          </button>
        </div>

        {/* Conditional Rendering of Content based on Active Tab */}
        <div className="tab-content">
          {activeTab === 'auto' ? (
            <RecentActivity />  // Show Auto Test Cases Activity
          ) : (
            <ManualActivity />  // Show Manual Test Cases Activity
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCaseManagement;