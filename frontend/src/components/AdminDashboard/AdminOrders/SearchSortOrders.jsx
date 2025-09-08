/* eslint-disable react/prop-types */
import { useState } from "react";

function SearchSortOrders({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [paymentType, setPaymentType] = useState("all");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ searchTerm: e.target.value, status, sortBy, paymentType });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onFilterChange({ searchTerm, status: e.target.value, sortBy, paymentType });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onFilterChange({ searchTerm, status, sortBy: e.target.value, paymentType });
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    onFilterChange({ searchTerm, status, sortBy, paymentType: e.target.value });
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md flex justify-between items-center">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded-md"
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={paymentType}
          onChange={handlePaymentTypeChange}
          className="p-2 border rounded-md"
        >
          <option value="all">All Payment Types</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="p-2 border rounded-md"
        >
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="totalAmount">Total Amount</option>
        </select>
      </div>
    </div>
  );
}

export default SearchSortOrders;
