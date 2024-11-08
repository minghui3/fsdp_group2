// TestRunComparisonChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const TestRunComparisonChart = () => {
  // Example data for last month and this month
  const days = ["1", "5", "10", "15", "20", "25", "30"];
  const lastMonthRuns = [70, 12, 14, 11, 15, 13, 100];
  const thisMonthRuns = [14, 16, 18, 15, 20, 18, 22];

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Last Month',
        data: lastMonthRuns,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        pointBackgroundColor: '#3498db',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'This Month',
        data: thisMonthRuns,
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
        pointBackgroundColor: '#9b59b6',
        fill: true,
        tension: 0.4,
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
      x: { title: { display: true, text: 'Day' } },
      y: { beginAtZero: true, title: { display: true, text: 'Test Runs' } },
    },
  };

  return (
    <div style={{textAlign: 'left', padding: '20px 30px', backgroundColor: '#fff', borderRadius: '20px' }}>
      <h2>Test Runs (Monthly Comparison)</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default TestRunComparisonChart;