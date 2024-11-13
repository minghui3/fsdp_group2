// src/components/TopFailingTests.js
import React from 'react';

const TopFailingTests = ({ failingTests }) => {
  // Calculating failure rate as a percentage
  const failureRate = failingTests.map(test => (test.failures / test.total) * 100);

  return (
    <div style={{ padding: '20px 30px', backgroundColor: '#fff', borderRadius: '20px', width: '100%' }}>
      <h2>Top Failing Tests</h2>
      
      {/* Header for the table */}
      <div style={{ color:'#96A5B8', display: 'flex', alignItems: 'center', marginBottom: '10px', fontWeight: 'bold', width: '100%' }}>
        <div style={{ flex: '1', textAlign: 'center' }}>#</div>
        <div style={{ flex: '3', textAlign: 'left', paddingLeft: '10px' }}>Test Name</div>
        <div style={{ flex: '3', textAlign: 'center' }}>Failure Rate</div>
        <div style={{ flex: '2', textAlign: 'center' }}>Failures</div>
      </div>

      <div style={{ width: '100%' }}>
        {failingTests.map((test, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderTop: index > 0 ? '1px solid #edf2f6' : 'none', width: '100%' }}>
            {/* Index number */}
            <div style={{ flex: '1', textAlign: 'center', fontWeight: 'bold' }}>
              {index + 1}
            </div>

            {/* Test Name */}
            <div style={{ flex: '3', paddingLeft: '10px' }}>
              {test.testName}
            </div>

            {/* Failure Rate and Progress Bar */}
            <div style={{ flex: '3', paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#ecaeae',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  width: `${failureRate[index]}%`,
                  height: '100%',
                  backgroundColor: '#f44336',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}></div>
                {/* Percentage inside the progress bar */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontWeight: 'bold',
                  color: '#fff',
                  fontSize: '12px',
                }}>
                  {failureRate[index].toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Number of Failures */}
            <div style={{ flex: '2', textAlign: 'center' }}>
              {test.failures} / {test.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFailingTests;