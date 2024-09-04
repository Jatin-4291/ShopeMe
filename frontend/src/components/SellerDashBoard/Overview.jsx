import React, { useEffect, useState } from "react";
import axios from "axios";
import PendingOrdersSection from "./OverviewData/PendingOrdersSection";
import RecentOrdersSection from "./OverviewData/RecentOrdersSection";
import TopSellingProductsSection from "./OverviewData/TopSellingProductsSection";
import OrderCountsSection from "./OverviewData/OrderCountsSection";
import RevenueSection from "./OverviewData/RevenueSection";
import { useUser } from "../../contexts/userContext";

function Overview() {
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    orderCounts: [],
    topSellingProducts: [],
    recentOrders: [],
    pendingOrders: [],
    customerReviews: [],
  });

  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/dashboard/${user._id}`
        );
        setOverviewData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [user._id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  const {
    totalRevenue,
    orderCounts,
    topSellingProducts,
    recentOrders,
    pendingOrders,
  } = overviewData;

  return (
    <div>
      <div className="grid gap-6 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Overview Sections */}
        <RevenueSection totalRevenue={totalRevenue} />
        <OrderCountsSection orderCounts={orderCounts} />
        <TopSellingProductsSection topSellingProducts={topSellingProducts} />

        {/* Custom styles for RecentOrdersSection and PendingOrdersSection */}
      </div>
      <div className="flex">
        <div className="col-span-1 md:col-span-2 lg:col-span-1 h-[250px] w-3/5">
          <RecentOrdersSection recentOrders={recentOrders} />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1  w-3/5">
          <PendingOrdersSection pendingOrders={pendingOrders} />
        </div>
      </div>
    </div>
  );
}

export default Overview;
