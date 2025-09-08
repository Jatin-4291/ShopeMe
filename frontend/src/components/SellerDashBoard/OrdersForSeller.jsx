import axios from "axios";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust imports as necessary

import SearchSortOrders from "./SearchSortOrders";
import OrderDetailsModal from "./OrderDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
      } finally {
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

  // Show loading spinner while data is being fetched
  if (loading)
    return (
      <div className="flex items-center justify-center p-4">
        <ClipLoader size={50} color="#6b46c1" />{" "}
        {/* You can adjust the size and color as needed */}
      </div>
    );

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl text-violet-900 font-bold mb-4">Orders</h2>
      <SearchSortOrders onFilterChange={handleFilterChange} />
      {filteredOrders.length === 0 ? (
        <div className="text-gray-500">No orders found</div>
      ) : (
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption>A list of all orders placed by sellers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="whitespace-nowrap text-sm font-medium text-gray-900">
                  {order._id}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.placedDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  <ul>
                    {order.products.map((item) => (
                      <li key={item._id} className="text-gray-700">
                        {item.productId.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  <Badge className={getStatusClass(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  <Button
                    onClick={() => handleOpenModal(order)}
                    variant="link"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
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
