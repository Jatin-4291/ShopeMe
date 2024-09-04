import { HiOutlineShoppingBag } from "react-icons/hi2";
import { MdCurrencyRupee } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";
import { FaRegUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import AdminTopSeller from "./AdminOverview/AdminTopSeller";
import AdminTopProducts from "./AdminOverview/AdminTopProducts";
import SalesByState from "./AdminOverview/SalesByState";
import OverviewNav from "./AdminOverview/OverviewNav";

import axios from "axios";
function AdminOverview() {
  const [adminStats, setAdminStats] = useState({});
  const [filteredStats, setFilteredStats] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/admin/");
        console.log(response.data.data);
        setAdminStats(response.data.data);
        setFilteredStats(response.data.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    console.log("hello");

    fetchData();
    console.log("hello2");
  }, []);
  const onSearch = (query) => {
    if (!query) {
      setFilteredStats(adminStats);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredProducts = adminStats.topProducts.filter((product) =>
      product.productName.toLowerCase().includes(lowerCaseQuery)
    );

    const filteredSellers = adminStats.topSellers.filter((seller) =>
      seller.sellerName.toLowerCase().includes(lowerCaseQuery)
    );
    console.log(filteredProducts, filteredSellers);

    if (filteredProducts.length > 0) {
      setFilteredStats({
        ...adminStats,
        topProducts: filteredProducts,
      });
    }
    if (filteredSellers.length > 0) {
      setFilteredStats({
        ...adminStats,
        topSellers: filteredSellers,
      });
    }
  };

  console.log("hello2");
  return (
    <div className="p-3 bg-gray-100">
      <OverviewNav onSearch={onSearch} />
      <div className="flex gap-10 bg-gray-100">
        <div className="bg-white border rounded-lg w-1/4 h-32">
          <div className="flex m-4 gap-3">
            <div
              style={{ position: "relative", width: "48px", height: "52px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="52"
                viewBox="0 0 48 52"
                fill="none"
              >
                <path
                  d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                  fill="#4a148c"
                ></path>
              </svg>
              <HiOutlineShoppingBag className="absolute -top-1 left-2 w-8 h-[52px] text-white" />
            </div>
            <div>
              <h1 className="text-xl">Total Sales</h1>
              <p className="text-2xl">{adminStats.totalSales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg w-1/4 h-32">
          <div className="flex m-4 gap-3">
            <div
              style={{ position: "relative", width: "48px", height: "52px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="52"
                viewBox="0 0 48 52"
                fill="none"
              >
                <path
                  d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                  fill="#4a148c"
                ></path>
              </svg>
              <MdCurrencyRupee className="absolute top-0 left-2 w-8 h-[52px] text-white" />
            </div>
            <div>
              <h1 className="text-xl">Total Income</h1>
              <p className="text-2xl">&#8377; {adminStats.totalIncome}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg w-1/4 h-32">
          <div className="flex m-4 gap-3">
            <div
              style={{ position: "relative", width: "48px", height: "52px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="52"
                viewBox="0 0 48 52"
                fill="none"
              >
                <path
                  d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                  fill="#4a148c"
                ></path>
              </svg>
              <ImFilesEmpty className="absolute top-0 left-3 w-7 h-[48px] text-white" />
            </div>
            <div>
              <h1 className="text-xl">Orders Paid</h1>
              <p className="text-2xl">{adminStats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg w-1/4 h-32">
          <div className="flex m-4 gap-3">
            <div
              style={{ position: "relative", width: "48px", height: "52px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="52"
                viewBox="0 0 48 52"
                fill="none"
              >
                <path
                  d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                  fill="#4a148c"
                ></path>
              </svg>
              <FaRegUser
                style={{
                  position: "absolute",
                  top: "1",
                  left: "10",
                  width: "26px",
                  height: "46px",
                  color: "white",
                }}
              />
            </div>
            <div>
              <h1 className="text-xl">Total Users</h1>
              <p className="text-2xl">{adminStats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 bg-gray-100 mt-4">
        {/* top rpoducts */}
        <div className="bg-white border rounded-lg w-2/5 h-96">
          <h1 className="text-xl font-semibold m-2">Top Products</h1>

          <AdminTopProducts adminStats={filteredStats} />
        </div>
        {/* top Sellers */}
        <div className="bg-white border rounded-lg w-2/5 h-96 ">
          <h1 className="text-xl font-semibold m-2">Top Sellers</h1>
          {console.log(adminStats)}
          <AdminTopSeller adminStats={filteredStats} />
        </div>
        {/* top sellers */}
        <div className="bg-white border rounded-lg w-1/5 h-96">
          <h1 className="text-xl font-semibold m-2">Sales By State</h1>
          <SalesByState adminStats={filteredStats} />
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
