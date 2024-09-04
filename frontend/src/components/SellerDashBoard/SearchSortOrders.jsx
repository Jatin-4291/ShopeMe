// src/components/SearchSortOrders.js
import React, { useState } from "react";

const SearchSortOrders = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [status, setStatus] = useState("all");
  const [paymentType, setPaymentType] = useState("all");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ searchTerm: e.target.value, sortBy, status, paymentType });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onFilterChange({ searchTerm, sortBy: e.target.value, status, paymentType });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onFilterChange({ searchTerm, sortBy, status: e.target.value, paymentType });
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    onFilterChange({ searchTerm, sortBy, status, paymentType: e.target.value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded"
        />
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="p-2 border rounded"
        >
          <option value="date">Sort by Date</option>
          <option value="totalAmount">Sort by Total Amount</option>
        </select>
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={paymentType}
          onChange={handlePaymentTypeChange}
          className="p-2 border rounded"
        >
          <option value="all">All Payment Types</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    </div>
  );
};

export default SearchSortOrders;
