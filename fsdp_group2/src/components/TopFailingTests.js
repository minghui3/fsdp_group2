import React from 'react';

const TopFailingTests = () => {
  // Example data for top failing tests
  const failingTests = [
    { name: "Network Issue", failures: 50, total: 100 },
    { name: "Code Defects", failures: 30, total: 100 },
    { name: "Environment Inconsistencies", failures: 20, total: 100 },
  ];

  // Calculating failure rate as a percentage
  const failureRate = failingTests.map(test => (test.failures / test.total) * 100);

  return (
    <div style={{ padding: '20px 30px', backgroundColor: '#fff', borderRadius: '20px' }}>
      <h2>Top Failing Tests</h2>
      {/* Header for the table */}
      <div style={{ color:'#96A5B8', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ width: '50px', textAlign: 'center', fontWeight: 'bold' }}>#</div>
        <div style={{ flex: 1, textAlign: 'left', paddingLeft: '10px', fontWeight: 'bold' }}>Test Name</div>
        <div style={{ width: '300px', textAlign: 'center', fontWeight: 'bold' }}>Failure Rate</div>
        <div style={{ width: '100px', textAlign: 'center', fontWeight: 'bold' }}>Failures</div>
      </div>
      <div>
        {failingTests.map((test, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '20px 0', paddingTop:'20px', borderTop:'1px solid #edf2f6'}}>
            {/* Index number */}
            <div style={{ width: '50px', textAlign: 'center', fontWeight: 'bold' }}>
              {index + 1}
            </div>

            {/* Test Name */}
            <div style={{ flex: 1, textAlign: 'left', paddingLeft: '10px' }}>
              {test.name}
            </div>

            {/* Failure Rate as a progress bar */}
            <div style={{ width: '150px', paddingLeft: '10px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '20px',
                backgroundColor: '#ecaeae',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${failureRate[index]}%`,
                  height: '100%',
                  backgroundColor: '#ef4444',
                  borderRadius: '10px',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                  {Math.round(failureRate[index])}%
                </div>
              </div>
            </div>

            {/* Number of Failures */}
            <div style={{ width: '100px', textAlign: 'center', fontWeight: 'bold' }}>
              {test.failures}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TopFailingTests;