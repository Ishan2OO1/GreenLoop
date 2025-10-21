import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
`;

const ChartTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--neutral-800);
`;

const ProcessChart = () => {
  const chartRef = useRef();

  const data = {
    labels: ['Shredding', 'Melting', 'Chemical', 'Pyrolysis'],
    datasets: [
      {
        label: 'Average GHG Emissions (kg CO₂e/ton)',
        data: [680, 625, 850, 950],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `${context.parsed.y} kg CO₂e/ton`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'var(--neutral-600)',
          font: {
            size: 12,
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'var(--neutral-600)',
          font: {
            size: 12,
          }
        }
      },
    },
  };

  return (
    <ChartContainer>
      <ChartTitle>Process Comparison</ChartTitle>
      <div style={{ height: '300px' }}>
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </ChartContainer>
  );
};

export default ProcessChart;
