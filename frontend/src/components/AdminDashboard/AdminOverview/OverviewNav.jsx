import React, { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUser } from "../../../contexts/userContext";
function OverviewNav({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex justify-between items-center p-4 mb-5 bg-white border-b">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-lg w-80"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FaSearch className="ml-2 text-gray-500" />
      </div>
      <div className="flex items-center gap-2">
        <FaUserCircle className="text-3xl text-gray-600" />
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <Link
          to="/logout"
          className="flex items-center gap-2 p-2 bg-red-500 text-white rounded-lg"
        >
          <FiLogOut />
          Logout
        </Link>
      </div>
    </div>
  );
}

export default OverviewNav;
