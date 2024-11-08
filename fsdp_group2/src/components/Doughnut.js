// PieChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend); // Registering the necessary components

const DoughnutChart = ({ passCount, failCount }) => {
  const data = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [passCount, failCount],
        backgroundColor: ['#4caf50', '#e74c3c'],
        hoverBackgroundColor: ['#66bb6a', '#ff7961'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false, // Hide legend if you don't want it to appear
      },
    },
  };

  return (
    <div style={{ textAlign: 'center', margin: '0 auto', padding:'20px 30px', backgroundColor: '#fff', borderRadius:'20px'}}>
      <h2 style={{textAlign:'left'}}>Test Outcome</h2>
      <Doughnut data={data} options={options} />

      {/* Two-column layout for labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
          paddingTop: '20px',
          fontSize: '16px',
          borderTop:'1px solid #979797',
        }}
      >
        {/* Passed Column */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#3cd856',
                borderRadius: '50%',
                marginRight: '8px',
              }}
            ></div>
            <span>Passed</span>
          </div>
          <div style={{ fontWeight: 'bold', marginTop: '5px' }}>{passCount}</div>
        </div>

        {/* Failed Column */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                marginRight: '8px',
              }}
            ></div>
            <span>Failed</span>
          </div>
          <div style={{ fontWeight: 'bold', marginTop: '5px' }}>{failCount}</div>
        </div>
      </div>
    </div>
  );
};
export default DoughnutChart;