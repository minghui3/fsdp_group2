import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { FaWeight } from 'react-icons/fa';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const LineGraph = ({ dateForLast10Days, passData, failData }) => {
  const data = {
    labels: dateForLast10Days, // Dates for the past 10 days
    datasets: [
      {
        label: 'Passed',
        data: passData, // Corrected to use 'passData' from props
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        pointBackgroundColor: '#4caf50',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Failed',
        data: failData, // Corrected to use 'failData' from props
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        pointBackgroundColor: '#e74c3c',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Show legend to distinguish Passed and Failed
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div  style={{textAlign: 'left', margin: '0 auto', padding:'20px 30px', backgroundColor: '#fff', borderRadius:'20px', width:'auto'}}>
      <h2>Test Outcomes Over the Last 10 Days</h2>
      <Line data={data} options={options} />
      {/* Two-column layout for labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
          paddingTop: '20px',
          fontSize: '16px',
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
                marginRight: '8px',
              }}
            ></div>
            <span>Passed</span>
          </div>
        </div>

        {/* Failed Column */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#ef4444',
                marginRight: '8px',
              }}
            ></div>
            <span>Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineGraph;