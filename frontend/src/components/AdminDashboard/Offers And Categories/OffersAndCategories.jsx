import { useState } from "react";
import Offers from "./Offers";
import AdminCategories from "./AdminCategories";
export default function OffersAndCategories() {
  const [activeTab, setActiveTab] = useState("offers");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen m-0 p-0">
      <div className="w-full h-24 shadow-md bg-white m-2 border border-gray-200 rounded-lg">
        <p className="text-2xl font-bold mt-4 ml-4 text-violet-900">
          Offers And Categories
        </p>
        <div className="flex gap-5 text-base ml-4 mt-4 text-gray-700">
          {/* Tab for Offers */}
          <div
            className={`cursor-pointer pb-2 ${
              activeTab === "offers"
                ? "border-b-2 border-violet-900 text-violet-900"
                : "hover:text-violet-700"
            }`}
            onClick={() => handleTabClick("offers")}
          >
            Offers
          </div>

          {/* Tab for Categories */}
          <div
            className={`cursor-pointer pb-2 ${
              activeTab === "admin-categories"
                ? "border-b-2 border-violet-900 text-violet-900"
                : "hover:text-violet-700"
            }`}
            onClick={() => handleTabClick("admin-categories")}
          >
            Categories
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 p-4 border-t border-gray-300">
          {activeTab === "offers" && <Offers />}
          {activeTab === "admin-categories" && <AdminCategories />}
        </div>
      </div>
    </div>
  );
}
