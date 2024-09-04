function OrderCountsSection({ orderCounts }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Order Counts</h3>
      <ul className="list-disc list-inside">
        {orderCounts.map((order) => (
          <li key={order._id} className="text-gray-700">
            {order._id}: {order.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderCountsSection;
