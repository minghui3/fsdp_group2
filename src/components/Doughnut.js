import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h2 style={{ textAlign: 'left' }}>Test Outcome</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};
export default DoughnutChart;