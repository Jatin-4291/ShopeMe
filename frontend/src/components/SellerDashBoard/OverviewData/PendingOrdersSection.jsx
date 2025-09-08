/* eslint-disable react/prop-types */
function PendingOrdersSection({ pendingOrders }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-[500px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
      <ul className="space-y-4">
        {pendingOrders.map((order) => (
          <li key={order._id} className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">Order ID: {order._id}</p>
            <p className="text-gray-500">Status: {order.status}</p>
            <p className="text-gray-500">Customer: {order.userId.name}</p>
            <p className="text-gray-700">Products:</p>
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
    </div>
  );
}

export default PendingOrdersSection;
