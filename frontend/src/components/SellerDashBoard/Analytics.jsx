import { useMemo, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import api from "../../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useUser } from "../../contexts/userContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import from ShadCN

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear()); // Default year selection
  const [sortType, setSortType] = useState("year"); // Default to yearly view
  const { user } = useUser();

  // Fetch available years for filtering
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years including current year
  }, []);

  useEffect(() => {
    // Fetch data from the API based on the selected year and sort type
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/dashboard/analytics/${user._id}?year=${year}&sortType=${sortType}`
        ); // Replace with your actual API endpoint

        setData(response.data.data.revenueAndOrderCount); // Assuming your API returns { success: true, data: [...] }
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id, year, sortType]);

  // Prepare table columns and rows manually
  const columns = useMemo(() => ["Date", "Total Revenue", "Order Count"], []);

  const rows = data.map((row) => ({
    id: row._id,
    totalRevenue: row.totalRevenue,
    orderCount: row.orderCount,
  }));

  // Prepare data for the chart
  const chartData = {
    labels: data.map((d) => d._id), // Date labels for the chart
    datasets: [
      {
        label: "Total Revenue",
        data: data.map((d) => d.totalRevenue),
        borderColor: "rgba(139, 92, 246, 1)", // Violet 900 touch for line
        backgroundColor: "rgba(139, 92, 246, 0.2)", // Violet 900 touch for fill color
        fill: true,
      },
      {
        label: "Order Count",
        data: data.map((d) => d.orderCount),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="analytics-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>

      {/* Year and Sort Type Selection */}
      <div className="mb-6 flex items-center gap-4">
        <div>
          <label htmlFor="year" className="mr-2">
            Select Year:
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border px-2 py-1"
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortType" className="mr-2">
            Sort By:
          </label>
          <select
            id="sortType"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>

      {/* Table using ShadCN components */}
      <Table className="w-full mb-6">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.totalRevenue}</TableCell>
              <TableCell>{row.orderCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Line Chart */}
      <div className="chart-container mt-8 mb-6 p-4 bg-gray-50 rounded-md shadow-md">
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
