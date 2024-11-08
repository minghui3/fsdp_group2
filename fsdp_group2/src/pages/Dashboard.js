// src/pages/Dashboard.js
import React from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import DoughnutChart from '../components/Doughnut';
import LineGraph from '../components/LineGeaph';
//import ChartComponent from '../charts/Chart';
import AutoCoverageChart from '../components/AutoCoverageChart';
import TestRunComparisonChart from '../components/TestRunComparisonChart';
import TopFailingTests from '../components/TopFailingTests';
import BrowserCoverageChart from '../components/BrowserCoverageChart';
import '../style/dashboard.css'; // Import the CSS file



const Dashboard = () => {
  return (
    <div className='dashboard-layout'>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        {/* First Row with Doughnut and Line Graph */}
      <div className="chart-row">
        <div className="doughnut-container">
          <DoughnutChart passCount={10} failCount={5} />
        </div>
        <div className="linegraph-container">
          <LineGraph />
        </div>
      </div>

      {/* Second row: Auto Coverage and Test Run Comparison */}
      <div className="chart-row">
        <div className="auto-coverage-container">
          <AutoCoverageChart />
        </div>
        <div className="test-run-container">
          <TestRunComparisonChart />
        </div>
      </div>

      {/* Third Row: Top Failing Tests and Browser Coverage */}
      <div className="chart-row" style={{marginBottom:'30px'}}>
          <div className="top-failing-tests-container">
            <TopFailingTests />
          </div>
          <div className="browser-coverage-container">
            <BrowserCoverageChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;