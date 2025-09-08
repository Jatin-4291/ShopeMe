/* eslint-disable react/prop-types */
import moment from "moment";

function RecentOrdersSection({ recentOrders }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-[500px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-violet-900">
        Recent Orders
      </h3>
      {recentOrders.length === 0 ? (
        <p className="text-gray-500">No recent orders available.</p>
      ) : (
        <ul className="space-y-4">
          {recentOrders.map((order) => (
            <li
              key={order._id}
              className="bg-gray-50 p-4 rounded-md shadow-sm border-l-4 border-violet-900"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-700 font-medium">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Status: {order.paymentStatus}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on:{" "}
                    {moment(order.placedDate).format("MMMM Do YYYY, h:mm A")}
                  </p>
                  <p className="text-gray-700 mt-2 font-medium">
                    Customer:{" "}
                    <span className="text-violet-900">
                      {order.userId.firstName} {order.userId.lastName}
                    </span>
                  </p>
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md">
                    Total: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mt-2 font-medium">Products:</p>
              <ul className="list-disc list-inside ml-4">
                {order.products.map((product) => (
                  <li key={product.productId._id} className="text-gray-500">
                    {product.productId.name} - Quantity: {product.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentOrdersSection;
