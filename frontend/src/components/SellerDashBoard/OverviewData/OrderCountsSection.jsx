/* eslint-disable react/prop-types */

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function OrderCountsSection({ orderCounts, orderCountsByDate }) {
  // Prepare data and options for the bar chart
  const data = {
    labels: orderCountsByDate.map((order) => order._id), // Extract dates for the x-axis
    datasets: [
      {
        label: "Order Counts",
        data: orderCountsByDate.map((order) => order.orderCount), // Extract order count values
        backgroundColor: "rgb(76 29 149)", // Bar color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false }, // Disable x-axis grid
      },
      y: {
        grid: { display: false }, // Disable y-axis grid
        beginAtZero: true, // Start y-axis from zero
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Order Counts</h3>
      <ul className="list-disc list-inside mb-4">
        {orderCounts.map((order) => (
          <li key={order._id} className="text-gray-700">
            {order._id}: {order.count}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default OrderCountsSection;
