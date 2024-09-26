import { useEffect, useState } from "react";
import axios from "axios";

function AdminPaySellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSellers, setTotalSellers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("highest");
  const limit = 8;

  const fetchSellersData = async (page) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/admin/payseller?page=${page}&limit=${limit}&search=${searchQuery}&sort=${sortOrder}`
      );
      setSellers(res.data.data.sellers);
      setTotalSellers(res.data.data.totalSellers);
      setLoading(false);
    } catch (err) {
      setError("Failed to load sellers data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellersData(currentPage);
  }, [currentPage, searchQuery, sortOrder]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const totalPages = Math.ceil(totalSellers / limit);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="w-full h-14 shadow-md bg-white m-2 border rounded-lg">
        <p className="text-xl text-violet-900 font-bold mt-4 ml-4">
          Seller Payment Management
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex bg-white justify-between mt-4 p-2">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md p-2 w-2/3"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
          <option value="mostOrders">Most Orders</option>
          <option value="leastOrders">Least Orders</option>
        </select>
      </div>

      {/* Sellers Table */}
      <div className="p-4 bg-white shadow-md rounded-lg mt-4">
        {sellers.length === 0 ? (
          <div className="text-gray-500">No sellers found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Seller Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-violet-900 uppercase tracking-wider">
                  Pay Sellers
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {seller.sellerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.mobileNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${seller.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-violet-600 hover:underline"
                      onClick={() => openModal(seller.orders)}
                    >
                      Show Details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-violet-600 hover:underline">
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal for showing order details */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-3/4 max-h-[80vh] overflow-y-auto transition-transform transform scale-100 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition duration-150"
              onClick={closeModal}
            >
              &times;
            </button>
            <table className="min-w-full divide-y-0">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-0">
                {selectedOrder?.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr>
                      <td colSpan="4">
                        <hr className="border-t border-gray-300 my-1" />
                      </td>
                    </tr>
                    {order.products.map((product) => (
                      <tr key={product.productId} className="border-0">
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                          <img
                            src={product.details.images[0]?.url}
                            alt={product.details.name}
                            className="w-16 h-16 object-cover"
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                          {product.details.name}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                          {product.quantity}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                          ${product.details.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPaySellers;
