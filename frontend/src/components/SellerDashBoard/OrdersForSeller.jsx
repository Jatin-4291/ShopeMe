import axios from "axios";
import { useEffect, useState } from "react";
import SearchSortOrders from "./SearchSortOrders";
import OrderDetailsModal from "./OrderDetailsModal";

function OrdersForSeller() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/orders");
        setOrders(response.data.data.orders);
        setFilteredOrders(response.data.data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = ({ searchTerm, sortBy, status, paymentType }) => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userId.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (paymentType !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentType
      );
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.placedDate) - new Date(a.placedDate);
        } else if (sortBy === "totalAmount") {
          return b.totalAmount - a.totalAmount;
        }
        return 0;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="w-[1175px] h-14 shadow-md bg-white m-2 border rounded-lg">
        <p className="text-xl text-violet-900 font-bold mt-4 ml-4">Orders</p>
      </div>
      <SearchSortOrders onFilterChange={handleFilterChange} />
      <div className="p-4">
        {filteredOrders.length === 0 ? (
          <div className="text-gray-500">No orders found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 text-violet-900 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 text-violet-900 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 text-violet-900 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 text-violet-900 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 text-violet-900 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 text-violet-900 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.placedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ul>
                      {order.products.map((item) => (
                        <li key={item._id} className="text-gray-700">
                          {item.productId.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleOpenModal(order)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
}

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-200 text-yellow-800";
    case "Shipped":
      return "bg-blue-200 text-blue-800";
    case "Delivered":
      return "bg-green-200 text-green-800";
    case "Cancelled":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default OrdersForSeller;
