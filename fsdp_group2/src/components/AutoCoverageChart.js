// AutoCoverageChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AutoCoverageChart = () => {
  // Example data for the past 7 days
  const dates = ["2023-10-11", "2023-10-12", "2023-10-13", "2023-10-14", "2023-10-15", "2023-10-16", "2023-10-17"];
  const autoTests = [70, 75, 80, 85, 78, 82, 90];  // Automated test coverage
  const manualTests = [30, 25, 20, 15, 22, 18, 10]; // Manual test coverage

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Automated Tests',
        data: autoTests,
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