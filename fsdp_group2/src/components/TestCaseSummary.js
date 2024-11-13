// src/components/TestCaseSummary.js
import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaCogs } from 'react-icons/fa'; // Import Font Awesome icons
import '../style/testCaseSummary.css'; // Separate CSS file for styling

const TestCaseSummary = ({ summaryData }) => {
  // Destructure the summaryData prop
  const { totalTestCase, currentMonth, lastMonth } = summaryData;

  // Function to calculate the percentage change
  const calculatePercentageChange = (current, last) => {
    return ((current - last) / last) * 100;
  };

  // Function to determine the color for the percentage change
  const getPercentageColor = (percentage) => {
    return percentage > 0 ? 'green' : percentage < 0 ? 'red' : 'gray';
  };

  return (
    <div className='summary'>
        <div className='summary-title'>
            <h2>Test Case Summary</h2>
        </div>

        <div className="summary-data">
            {/* Total Test Cases Card */}
            <div className="summary-card">
                <div className="card-left">
                <FaCogs size={50} className="card-icon total-test" />
                </div>
                <div className="card-right">
                <h3 style={{fontSize:'14px', color:'#ACACAC', fontWeight:'400'}}>Total Test Cases</h3>
                <p style={{ fontSize:'32px', color:'#333'}}>{totalTestCase.total}</p>
                <div>
                    <span style={{fontSize:'11px'}} className={`percentage ${getPercentageColor(calculatePercentageChange(currentMonth.total, lastMonth.total))}`}>
                        <b>{currentMonth.total > lastMonth.total ? '↑ ' : '↓ '}</b>
                        {calculatePercentageChange(currentMonth.total, lastMonth.total).toFixed(2)}%{' '}
                    </span>
                    <span style={{color:'#292d32', fontSize:'11px'}}> this month</span>
                </div>
                </div>
            </div>

            {/* Passed Test Cases Card */}
            <div className="summary-card passed">
                <div className="card-left">
                <FaCheckCircle size={50} className="card-icon passed-test" />
                </div>
                <div className="card-right">
                <h3 style={{fontSize:'14px', color:'#ACACAC', fontWeight:'400'}}>Passed</h3>
                <p style={{ fontSize:'32px', color:'#333'}}>{currentMonth.passed}</p>
                <div>
                        <span style={{fontSize:'11px'}} className={`percentage ${getPercentageColor(calculatePercentageChange(currentMonth.passed, lastMonth.passed))}`}>
                            <b>{currentMonth.passed > lastMonth.passed ? '↑ ' : '↓ '} </b>
                            {calculatePercentageChange(currentMonth.passed, lastMonth.passed).toFixed(2)}%{' '} 
                        </span>
                        <span style={{color:'#292d32', fontSize:'11px'}}> this month</span>
                </div>
                </div>
            </div>

            {/* Failed Test Cases Card */}
            <div className="summary-card failed">
                <div className="card-left">
                <FaTimesCircle size={50} className="card-icon failed-test" />
                </div>
                <div className="card-right">
                    <h3 style={{fontSize:'14px', color:'#ACACAC', fontWeight:'400'}}>Failed</h3>
                    <p style={{ fontSize:'32px', color:'#333'}}>{currentMonth.failed}</p>
                    <div>
                        <span  style={{fontSize:'11px'}} className={`percentage ${getPercentageColor(calculatePercentageChange(currentMonth.failed, lastMonth.failed))}`}>
                            <b>{currentMonth.failed > lastMonth.failed ? '↑ ' : '↓ '}</b>
                            {calculatePercentageChange(currentMonth.failed, lastMonth.failed).toFixed(2)}%{' '}
                        </span>
                        <span style={{color:'#292d32', fontSize:'11px'}}> this month</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TestCaseSummary;