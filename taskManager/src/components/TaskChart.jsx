import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// This registers the necessary components for Chart.js to work.
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TaskChart = ({ tasks = [] }) => {
  // This code processes your tasks and counts how many are in each status category.
  // useMemo is a performance optimization that ensures this calculation only runs when the 'tasks' prop changes.
  const statusCounts = useMemo(() => {
    const counts = {
      'To Do': 0,
      'In Progress': 0,
      'Done': 0,
    };
    tasks.forEach(task => {
      // Check if the status exists in our counts object before incrementing
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });
    return counts;
  }, [tasks]);

  // This is the data structure that Chart.js uses for the pie chart.
  const chartData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: ' Tasks',
        data: [statusCounts['To Do'], statusCounts['In Progress'], statusCounts['Done']],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',  // Blue for To Do
          'rgba(255, 206, 86, 0.7)',  // Yellow for In Progress
          'rgba(75, 192, 192, 0.7)',   // Green for Done
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // These options style the chart to look good on your dark theme.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fit the container height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // Legend text color (e.g., 'To Do', 'Done')
          font: {
            size: 14,
          }
        }
      },
      title: {
        display: false, // The dashboard already has a title for this section
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
      }
    },
    cutout: '60%', // This makes it a "Doughnut" chart, which looks a bit more modern.
  };

  // We add a wrapper div to control the chart's size.
  return (
    <div style={{ position: 'relative', height: '300px', marginTop: '20px' }}>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default TaskChart;