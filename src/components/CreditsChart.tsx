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
import { ConsumptionData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CreditsChartProps {
  data: ConsumptionData;
  onDateClick: (date: string) => void;
}

export default function CreditsChart({ data, onDateClick }: CreditsChartProps) {

  const chartData = {
    labels: data.dates,
    datasets: data.datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Credits Consumed Per Day',
        },
        ticks: {
          callback: function(value: unknown) {
            return typeof value === 'number' ? value.toLocaleString() : value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          footer: function(tooltipItems: any[]) {
            const total = tooltipItems.reduce((sum, item) => {
              return sum + (item.parsed.y || 0);
            }, 0);
            return 'Total: ' + total.toLocaleString() + ' credits';
          },
        },
      },
    },
    onClick: (event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const date = data.dates[index];
        onDateClick(date);
      }
    },
    onHover: (event: any, elements: any[]) => {
      if (event.native && event.native.target) {
        event.native.target.style.cursor = elements && elements.length > 0 ? 'pointer' : 'default';
      }
    },
  };

  return (
    <div className="mb-8">
      <div className="h-96 relative">
        <Bar data={chartData} options={options} />
      </div>
      <div className="flex flex-wrap gap-5 justify-center mt-5 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#ff9500]" />
          <span className="text-sm text-gray-700">Unstructured Data Processed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#5ac8fa]" />
          <span className="text-sm text-gray-700">Batch Data Pipeline</span>
        </div>
      </div>
    </div>
  );
}

