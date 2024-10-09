import { useState } from "react";
import AdminOverview from "../components/AdminDashboard/AdminOverview";
import AdminOrders from "../components/AdminDashboard/AdminOrders";
import AdminUsers from "../components/AdminDashboard/AdminUsers";
import AdminPaySellers from "../components/AdminDashboard/AdminPaySellers/AdminPaySellers";
import OffersAndCategories from "../components/AdminDashboard/Offers And Categories/OffersAndCategories";
import { FaBars } from "react-icons/fa"; // Icon for the hamburger menu
import { FaTimes } from "react-icons/fa"; // Icon for the cross button (X)
import VerifySellers from "../components/AdminDashboard/VerifySeller/VerifySellers";
function AdminDashboard() {
  // State to track the current view
  const [currentView, setCurrentView] = useState("overview");

  // State to toggle the sidebar on mobile devices
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Functions to set the current view
  const handleViewChange = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar when a view is selected on mobile
  };

  return (
    <div className="flex h-screen w-full">
      {/* Hamburger icon - only visible on mobile screens */}
      <div className="sm:hidden p-4">
        <FaBars onClick={toggleSidebar} className="text-2xl cursor-pointer" />
      </div>

      {/* Sidebar - Keep this fixed */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } sm:block w-1/2 sm:w-1/5 bg-violet-900 text-white h-full sm:h-screen sm:relative fixed z-50`}
      >
        <div className="flex justify-between items-center m-5 mt-10">
          <div className="font-bold text-3xl text-yellow-400">
            Admin Dashboard
            <div className="font-medium text-white text-xl">
              <span>by</span>
              <span className="font-bold"> ApniDukan</span>
            </div>
          </div>

          {/* Close Button (Cross "X") */}
          <FaTimes
            onClick={toggleSidebar}
            className="text-2xl cursor-pointer sm:hidden"
          />
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
                onClick={() => handleViewChange("verifyseller")}
                className="block px-4 py-2 text-lg hover:bg-violet-700 rounded"
              >
                Verify Sellers
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

      {/* Main Content Area with scrollable content */}
      <div className="w-full sm:w-4/5 bg-gray-100 p-6 overflow-y-auto h-screen">
        {currentView === "overview" && <AdminOverview />}
        {currentView === "orders" && <AdminOrders />}
        {currentView === "users" && <AdminUsers />}
        {currentView === "paysellers" && <AdminPaySellers />}
        {currentView === "verifyseller" && <VerifySellers />}
        {currentView === "offersandcategories" && <OffersAndCategories />}
        {currentView === "settings" && <div>Settings Content</div>}
      </div>
    </div>
  );
}

export default AdminDashboard;
