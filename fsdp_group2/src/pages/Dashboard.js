// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import DoughnutChart from '../components/Doughnut';
import LineGraph from '../components/LineGraph';
import AutoCoverageChart from '../components/AutoCoverageChart';
import TestRunComparisonChart from '../components/TestRunComparisonChart';
import TopFailingTests from '../components/TopFailingTests';
import BrowserCoverageChart from '../components/BrowserCoverageChart';
import axios from 'axios';
import '../style/dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard-data');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <p>Loading...</p>; // Loading state while data is being fetched
  }

  return (
    <div className='dashboard-layout'>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
      {/* First Row with Doughnut and Line Graph */}
      <div className="chart-row">
        <div className="doughnut-container">
          <DoughnutChart passCount={dashboardData.doughnut.passCount} failCount={dashboardData.doughnut.failCount}/>
        </div>
        <div className="linegraph-container">
        <LineGraph
              dateForLast10Days={dashboardData.lineGraph.dateForLast10Days}  // Use the correct prop name
              passData={dashboardData.lineGraph.passCount}  // Ensure you are passing the correct prop
              failData={dashboardData.lineGraph.failCount}  // Same for failData
            />
        </div>
      </div>

      {/* Second row: Auto Coverage and Test Run Comparison
      <div className="chart-row">
        <div className="auto-coverage-container">
          <AutoCoverageChart 
            labels={dashboardData.autoCoverage.dateForLast7Days} // Pass labels for the last 7 days
            automatedTests={dashboardData.autoCoverage.autoTests} // Pass the automated test data
            manualTests={dashboardData.autoCoverage.manualTests} // Pass the manual test data if available
          />
        </div>
        <div className="test-run-container">
          <TestRunComparisonChart />
        </div>
      </div> */}

      {/* Third Row: Recent Failed Test*/}
      <div className="chart-row" style={{marginBottom:'30px'}}>
          <div className="top-failing-tests-container">
            <TopFailingTests failingTests={dashboardData.recentFailedTests.recentFailedRecord} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;