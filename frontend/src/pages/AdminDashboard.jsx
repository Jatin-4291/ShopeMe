import { useState } from "react";
import AdminOverview from "../components/AdminDashboard/AdminOverview";
import AdminOrders from "../components/AdminDashboard/AdminOrders";
import AdminUsers from "../components/AdminDashboard/AdminUsers";
import AdminPaySellers from "../components/AdminDashboard/AdminPaySellers/AdminPaySellers";
import OffersAndCategories from "../components/AdminDashboard/Offers And Categories/OffersAndCategories";
function AdminDashboard() {
  // State to track the current view
  const [currentView, setCurrentView] = useState("overview");

  // Functions to set the current view
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-1/5 bg-violet-900 text-white">
        <div className="font-bold text-3xl m-5 mt-10 text-yellow-400">
          Admin Dashboard
          <div className="font-medium text-white text-xl">
            <span>by</span>
            <span className="font-bold"> ApniDukan</span>
          </div>
        </div>
        <nav className="mt-10">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleViewChange("overview")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("orders")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("users")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("paysellers")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Pay Sellers
              </button>
            </li>
            <li>
              <button
                onClick={() => handleViewChange("offersandcategories")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Offers And Categories
              </button>
            </li>

            <li>
              <button
                onClick={() => handleViewChange("settings")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 bg-gray-100">
        {currentView === "overview" && <AdminOverview />}
        {currentView === "orders" && <AdminOrders />}
        {currentView === "users" && <AdminUsers />}
        {currentView === "paysellers" && <AdminPaySellers />}
        {currentView === "offersandcategories" && <OffersAndCategories />}
        {currentView === "settings"}
      </div>
    </div>
  );
}

export default AdminDashboard;
