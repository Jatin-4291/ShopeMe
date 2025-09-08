import ReactDOM from "react-dom";

function OrderDetailsModal({ order, onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg z-10 w-[600px]">
        <h3 className="text-xl font-semibold text-violet-900 mb-4">
          Order Details
        </h3>
        <div className="flex flex-wrap gap-6">
          {/* Customer Details */}
          <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-violet-900 mb-3">
              Customer Information
            </h4>
            <p className="mt-2">
              <strong className="text-violet-900">Customer ID:</strong>{" "}
              {order.userId._id}
            </p>
            <p className="mt-2">
              <strong className="text-violet-900">Customer Name:</strong>{" "}
              {order.userId.firstName} {order.userId.lastName}
            </p>
            <p className="mt-2">
              <strong className="text-violet-900">Email:</strong>{" "}
              {order.userId.email}
            </p>
            <p className="mt-2">
              <strong className="text-violet-900">Mobile Number:</strong>{" "}
              {order.userId.mobileNumber}
            </p>
          </div>

          {/* Shipping Address and Payment Status */}
          <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-violet-900 mb-3">
              Order Details
            </h4>
            <p className="mt-2">
              <strong className="text-violet-900">Shipping Address:</strong>
              <br />
              {order.userId.address.hNo}, {order.userId.address.street},{" "}
              {order.userId.address.area}, {order.userId.address.district},{" "}
              {order.userId.address.state}
            </p>
            <p className="mt-2">
              <strong className="text-violet-900">Payment Status:</strong>{" "}
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <h4 className="text-lg font-semibold text-violet-900 mt-6 mb-3">
          Items
        </h4>
        <ul>
          {order.products.map((item) => (
            <li key={item._id} className="mb-2">
              {item.productId.name} x {item.quantity} - $
              {item.productId.price.toFixed(2)}
            </li>
          ))}
        </ul>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-violet-900 text-white rounded hover:bg-violet-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default OrderDetailsModal;
