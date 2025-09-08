import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
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
} from "chart.js";

// Register the required components with ChartJS
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

function RevenueSection({ overallTotalRevenue, revenueByDate }) {
  console.log(revenueByDate);

  // Prepare data and options for the line chart
  const data = {
    labels: revenueByDate.map((entry) => entry._id), // Extract dates for the x-axis
    datasets: [
      {
        label: "Revenue",
        data: revenueByDate.map((entry) => entry.totalRevenue), // Extract revenue values
        borderColor: "rgb(76 29 149 1)",
        backgroundColor: "rgb(76 29 149 1)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } }, // Disable x-axis grid
      y: {
        grid: { display: false },
        ticks: {
          callback: (value) => `$${value}`, // Format y-axis ticks as currency
          stepSize: 10000, // Set the step size for y-axis ticks to 10,000
        },
        beginAtZero: true, // Start the y-axis at zero
      },
    },
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg">
      <CardHeader className="p-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Total Revenue
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <p className="text-2xl font-bold text-green-600">
          ${overallTotalRevenue.toFixed(2)}
        </p>
        <div className="mt-6">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueSection;
