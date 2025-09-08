/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal component

function DisplayOrders({ filter, orders }) {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === filter);
      setFilteredOrders(filtered);
    }
  }, [filter, orders]);

  const openModal = (order) => {
    setOrderToCancel(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderToCancel(null);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/orders/${orderToCancel._id}`,
        {
          status: "Cancelled",
        }
      );

      setFilteredOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderToCancel._id ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel the order. Please try again.");
    } finally {
      closeModal();
    }
  };

  return (
    <div>
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            className="mb-8 p-4 border border-gray-300 rounded-lg shadow-md bg-white"
          >
            <h4 className="text-lg font-semibold mb-4">
              Order ID: {order._id}
            </h4>
            <div className="space-y-4 flex justify-between">
              <div>
                <h5 className="font-bold">Items:</h5>
                <div className="space-y-2">
                  {order.products.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex items-center pb-2"
                    >
                      <img
                        className="w-20 h-20 object-cover"
                        src={item.productId.images[0].url}
                        alt={item.productId.name}
                      />
                      <div className="ml-4 flex-1">
                        <h5 className="text-lg font-semibold">
                          {item.productId.name}
                        </h5>
                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-gray-500">
                          Price: ${item.productId.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600">
                  Order Date: {new Date(order.placedDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Total Price: ${order.totalAmount.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Status: <span className="font-bold">{order.status}</span>
                </p>
                {/* Cancel Order button */}
                {order.status === "Placed" && (
                  <button
                    onClick={() => openModal(order)}
                    className="mt-2 text-red-600 py-2 rounded hover:text-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}

export default DisplayOrders;
