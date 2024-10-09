import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/ui/select"; // You can import other components too
import { Input } from "@/components/ui/input"; // You can import other components too
import { Button } from "@/components/ui/button"; // You can import other components too

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
      setLoading(true);
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

  if (loading) {
    return <div className="loader"></div>; // Use your .loader class here
  }

  if (error) {
    return <div>{error}</div>;
  }

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
        <Input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md p-2 w-2/3"
        />
        {/* <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
          <option value="mostOrders">Most Orders</option>
          <option value="leastOrders">Least Orders</option>
        </Select> */}
      </div>

      {/* Sellers Table */}
      <div className="p-4 bg-white shadow-md rounded-lg mt-4">
        {sellers.length === 0 ? (
          <div className="text-gray-500">No sellers found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Pay Sellers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller._id}>
                  <TableCell>{seller.sellerName}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.mobileNumber}</TableCell>
                  <TableCell>{seller.orderCount}</TableCell>
                  <TableCell>${seller.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => openModal(seller.orders)}
                    >
                      Show Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="link">Pay</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder?.map((order) => (
                  <React.Fragment key={order._id}>
                    <TableRow>
                      <TableCell colSpan="4">
                        <hr className="border-t border-gray-300 my-1" />
                      </TableCell>
                    </TableRow>
                    {order.products.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>
                          <img
                            src={product.details.images[0]?.url}
                            alt={product.details.name}
                            className="w-16 h-16 object-cover"
                          />
                        </TableCell>
                        <TableCell>{product.details.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          ${product.details.price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPaySellers;
