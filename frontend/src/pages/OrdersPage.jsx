import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/userContext";
import Navbar from "../components/Navbar";
import DisplayOrders from "../components/DisplayOrders";
import { ClipLoader } from "react-spinners";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/v1/orders/getOrder/${user._id}`
        );
        setOrders(data.data.orders);
        setFilteredOrders(data.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("An error occurred while fetching the orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filter));
    }
  }, [filter, orders]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed w-full z-50 bg-white shadow-lg">
        <Navbar />
        <div className="bg-violet-900 text-white p-4 flex justify-center">
          <ul className="flex space-x-4">
            <li
              className={`cursor-pointer py-2 px-4 rounded ${
                filter === "all" ? "bg-violet-700 font-bold" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              All Orders
            </li>
            <li
              className={`cursor-pointer py-2 px-4 rounded ${
                filter === "Delivered" ? "bg-violet-700 font-bold" : ""
              }`}
              onClick={() => setFilter("Delivered")}
            >
              Delivered
            </li>
            <li
              className={`cursor-pointer py-2 px-4 rounded ${
                filter === "Placed" ? "bg-violet-700 font-bold" : ""
              }`}
              onClick={() => setFilter("Placed")}
            >
              Placed
            </li>
            <li
              className={`cursor-pointer py-2 px-4 rounded ${
                filter === "Cancelled" ? "bg-violet-700 font-bold" : ""
              }`}
              onClick={() => setFilter("Cancelled")}
            >
              Cancelled
            </li>
          </ul>
        </div>
      </div>

      {/* Orders Content */}
      <div className="flex-1 overflow-y-auto pt-36 bg-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#6B46C1" loading={loading} size={50} />
          </div>
        ) : filteredOrders.length > 0 ? (
          <DisplayOrders filter={filter} orders={filteredOrders} />
        ) : (
          <div className="text-center text-gray-600">No orders found.</div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
