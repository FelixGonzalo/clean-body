'use client';

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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const fullLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ProgressChart = ({
  thisWeekCount,
  lastWeekCount,
}: {
  thisWeekCount: number[];
  lastWeekCount: number[];
}) => {
  return (
    <div className="min-h-50">
      <h2 className="mb-4 text-gray-500 font-bold ">Progreso</h2>
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  const index = tooltipItems[0].dataIndex;
                  return fullLabels[index]; // Muestra el nombre completo del día
                },
                label: function (context) {
                  return `Retos completados: ${context.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: 'Esta semana',
              data: thisWeekCount,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Semana pasada',
              data: lastWeekCount,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        }}
      />
    </div>
  );
};
