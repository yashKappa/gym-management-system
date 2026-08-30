import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DietPlansChart = ({ isDarkMode }) => {
  const [chartData, setChartData] = useState({
    labels: ['Beginner', 'Regular', 'Professional'],
    datasets: [
      {
        label: 'Number of Diet Plans',
        data: [0, 0, 0],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        pointBackgroundColor: '#4caf50',
        pointBorderColor: isDarkMode ? '#1a1f2c' : '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#4caf50',
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4, // Smooth curved line
        fill: true,   // Area highlight under line
      },
    ],
  });

  // Real-time Firestore Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Details', 'Diets', 'plans'),
      (snapshot) => {
        const counts = { beginner: 0, regular: 0, professional: 0 };
        snapshot.docs.forEach((doc) => {
          const level = doc.data().level?.toLowerCase();
          if (counts.hasOwnProperty(level)) {
            counts[level] += 1;
          }
        });

        setChartData({
          labels: ['Beginner', 'Regular', 'Professional'],
          datasets: [
            {
              label: 'Number of Diet Plans',
              data: [counts.beginner, counts.regular, counts.professional],
              borderColor: '#4caf50',
              backgroundColor: isDarkMode
                ? 'rgba(76, 175, 80, 0.2)'
                : 'rgba(76, 175, 80, 0.1)',
              pointBackgroundColor: '#4caf50',
              pointBorderColor: isDarkMode ? '#1a1f2c' : '#ffffff',
              pointHoverBackgroundColor: '#ffffff',
              pointHoverBorderColor: '#4caf50',
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
              fill: true,
            },
          ],
        });
      },
      (error) => {
        console.error('❌ Error fetching line chart data:', error);
      }
    );

    return () => unsubscribe();
  }, [isDarkMode]);

  // Dynamic Theme Colors
  const textColor = isDarkMode ? '#e0e6ed' : '#2b2d42';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Inter, sans-serif', weight: '500' },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#1a1f2c' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#1a1f2c',
        bodyColor: textColor,
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor, stepSize: 1 },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`diet-chart-wrapper mt-4 p-4 rounded-3 ${isDarkMode ? 'dark-card' : 'light-card'}`}>
      <h4 className="chart-title text-center mb-3" style={{ color: textColor }}>
        📈 Diet Plan Distribution Trend
      </h4>
      <div style={{ height: '350px', position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DietPlansChart;