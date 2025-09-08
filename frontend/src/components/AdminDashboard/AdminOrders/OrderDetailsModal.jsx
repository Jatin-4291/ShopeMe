/* eslint-disable react/prop-types */
function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Order Details
        </h2>
        <div className="space-y-6">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Order ID:</span>
            <span className="text-gray-900">{order._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Customer Name:</span>
            <span className="text-gray-900">
              {order.userId.firstName} {order.userId.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{order.userId.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Mobile:</span>
            <span className="text-gray-900">{order.userId.mobileNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="text-gray-900 text-right">
              {`${order.userId.address.hNo}, ${order.userId.address.street}, ${order.userId.address.area}, ${order.userId.address.district}, ${order.userId.address.state}, ${order.userId.address.pincode}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span className="text-gray-900">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Payment Status:</span>
            <span className="text-gray-900">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Total Amount:</span>
            <span className="text-gray-900">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Placed Date:</span>
            <span className="text-gray-900">
              {new Date(order.placedDate).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Items:</span>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              {order.products.map((item) => (
                <li key={item._id} className="text-gray-900">
                  {item.productId.name} - Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
