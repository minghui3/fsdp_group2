// AutoCoverageChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AutoCoverageChart = ({labels, automatedTests, manualTests}) => {

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Automated Tests',
        data: automatedTests,
        backgroundColor: '#4caf50',
      },
      {
        label: 'Manual Tests',
        data: manualTests,
        backgroundColor: '#e74c3c',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { beginAtZero: true, title: { display: true, text: 'Coverage (%)' } },
    },
  };

  return (
    <div style={{ textAlign: 'left', padding: '20px 30px', backgroundColor: '#fff', borderRadius: '20px' }}>
      <h2>Automation Coverage (Last 7 Days)</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AutoCoverageChart;