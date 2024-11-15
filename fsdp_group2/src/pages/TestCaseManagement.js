// src/pages/TestCaseManagement.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import TestCaseSummary from '../components/TestCaseSummary'; // Import TestCaseSummary component
import RecentActivity from '../components/RecentActivity'; // Import RecentActivity
import '../style/testCaseManagement.css'; // Import the CSS file

const TestCaseManagement = () => {
  // State to store the summary data
  const [summaryData, setSummaryData] = useState({
    totalTestCase: {},
    currentMonth: {},
    lastMonth: {},
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test-case-summary'); // Backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSummaryData(data); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching test case summary:', error);
        setError('Failed to fetch test case summary');
      }
      finally{
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading){
    return <div>Loading: {loading}</div>
  }
    // If there is an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='testCaseManagement-layout'>
      <Sidebar />
      <div className='testCaseManagement-container'>
        <Navbar />
        {/* Pass the fetched summary data to the TestCaseSummary component */}
        <TestCaseSummary summaryData={summaryData} />
        {/* Recent Activity Component */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default TestCaseManagement;