import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const data = {
  labels: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Professional'],
  datasets: [
    {
      label: 'Number of Diet Plans',
      data: [2, 5, 10, 8, 7],
      backgroundColor: [
        '#81c784',
        '#4caf50',
        '#2196f3',
        '#1976d2',
        '#ff9800',
      ],
    },
  ],
};

const options = {
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function TestBarChart() {
  return (
    <div style={{ width: 600, height: 400 }}>
      <Bar data={data} options={options} />
    </div>
  );
}


