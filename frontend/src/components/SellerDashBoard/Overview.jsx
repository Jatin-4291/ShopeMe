import { useEffect, useState } from "react";
import api from "../../../utils/api";
import PendingOrdersSection from "./OverviewData/PendingOrdersSection";
import RecentOrdersSection from "./OverviewData/RecentOrdersSection";
import TopSellingProductsSection from "./OverviewData/TopSellingProductsSection";
import OrderCountsSection from "./OverviewData/OrderCountsSection";
import RevenueSection from "./OverviewData/RevenueSection";
import { useUser } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import AllReviews from "./OverviewData/AllReviews";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader

function Overview() {
  const [overviewData, setOverviewData] = useState({
    overallTotalRevenue: 0,
    orderCounts: [],
    topSellingProducts: [],
    recentOrders: [],
    pendingOrders: [],
    orderCountsByDate: [],
    revenueByDate: [],
    allReviews: [],
  });

  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await api.get(`/dashboard/${user._id}`);
        console.log(response.data); // Log the response data

        setOverviewData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [user._id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#5B21B6" loading={loading} size={50} />
      </div>
    ); // Display ClipLoader while loading

  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  const {
    overallTotalRevenue,
    revenueByDate,
    orderCounts,
    topSellingProducts,
    recentOrders,
    pendingOrders,
    orderCountsByDate,
    allReviews,
  } = overviewData;

  return (
    <div>
      <div className="w-full h-14 shadow-md bg-white mt-2 ml-2 border rounded-lg flex justify-between">
        <p className="text-xl text-violet-900 font-bold mt-4 ml-4">Overview</p>
        <Link
          to="/logout"
          className="flex items-center gap-2 px-2 h-10 m-2 bg-red-500 text-white rounded-lg"
        >
          <FiLogOut />
          Logout
        </Link>
      </div>
      <div>
        <div className="grid gap-6 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Sections */}
          <RevenueSection
            overallTotalRevenue={overallTotalRevenue}
            revenueByDate={revenueByDate}
          />
          <OrderCountsSection
            orderCounts={orderCounts}
            orderCountsByDate={orderCountsByDate}
          />
          <TopSellingProductsSection topSellingProducts={topSellingProducts} />
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:w-2/3">
            {/* Container for Recent Orders */}
            <RecentOrdersSection recentOrders={recentOrders} />
          </div>
          <div className="flex flex-col md:flex-row flex-1 md:w-1/3">
            <div className="flex-1 h-full">
              {/* Make this container full height */}
              <PendingOrdersSection pendingOrders={pendingOrders} />
            </div>
            <div className="flex-1 h-full">
              {/* Make this container full height */}
              <AllReviews allReviews={allReviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
