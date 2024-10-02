import axios from "axios";
import { useEffect, useState } from "react";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStock, setNewStock] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [searchField, setSearchField] = useState("name"); // Field to search by
  const [sortCriteria, setSortCriteria] = useState("name"); // Default sort criteria
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction

  useEffect(() => {
    const getSellerProductsList = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/product/"
        );
        console.log(response.data.data.products);

        setProducts(response.data.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    };
    getSellerProductsList();
  }, []);

  const handleStockChange = (productId, value) => {
    setNewStock((prevStock) => ({
      ...prevStock,
      [productId]: value,
    }));
  };

  const handleStockSubmit = async (product) => {
    try {
      const updatedStock =
        Number(product.stock) + Number(newStock[product._id] || 0);
      await axios.patch(`http://127.0.0.1:8000/api/v1/product/${product._id}`, {
        stock: updatedStock,
      });

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === product._id ? { ...p, stock: updatedStock } : p
        )
      );
      setNewStock((prevStock) => ({
        ...prevStock,
        [product._id]: "",
      }));
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("Failed to update stock");
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    if (searchField === "name")
      return product.name.toLowerCase().includes(query);
    if (searchField === "brand")
      return product.brand.toLowerCase().includes(query);
    if (searchField === "category")
      return product.category.name.toLowerCase().includes(query);
    return false;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const criteria = sortCriteria;
    const direction = sortDirection === "asc" ? 1 : -1;

    if (a[criteria] < b[criteria]) return -1 * direction;
    if (a[criteria] > b[criteria]) return 1 * direction;
    return 0;
  });

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const getStatusTextColor = (status, stock) => {
    if (status === "In stock") return "text-green-500";
    if (stock < 10) return "text-yellow-700";
    return "text-red-500";
  };

  return (
    <div className="p-2">
      <div className="flex justify-between  mb-4">
        <div className="flex gap-5">
          <input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-2/5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-900 focus:border-violet-900 sm:text-sm mb-2"
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="p-2 w-2/5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-900 focus:border-violet-900 sm:text-sm mb-2"
          >
            <option value="name">Search by Name</option>
            <option value="brand">Search by Brand</option>
            <option value="category">Search by Category</option>
          </select>
        </div>
        <div className="flex space-x-4 mb-4">
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-900 focus:border-violet-900 sm:text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="brand">Sort by Brand</option>
            <option value="stock">Sort by Stock</option>
            <option value="status">Sort by Status</option>
          </select>
          <div className="flex items-center">
            <button
              onClick={() => setSortDirection("asc")}
              className={`p-2 border border-gray-300 rounded-l-md ${
                sortDirection === "asc"
                  ? "bg-violet-900 text-white"
                  : "bg-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setSortDirection("desc")}
              className={`p-2 border border-gray-300 rounded-r-md ${
                sortDirection === "desc"
                  ? "bg-violet-900 text-white"
                  : "bg-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {sortedProducts.length === 0 ? (
        <div className="text-gray-500">No products found</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Add Stock
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  {product.images.length > 0 && (
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || "Product Image"}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusTextColor(
                    product.status,
                    product.stock
                  )}`}
                >
                  {product.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <form
                    className="flex items-center"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleStockSubmit(product);
                    }}
                  >
                    <input
                      type="number"
                      value={newStock[product._id] || ""}
                      onChange={(e) =>
                        handleStockChange(product._id, e.target.value)
                      }
                      placeholder="Add Stock"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-900 focus:border-violet-900 sm:text-sm"
                    />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyProducts;
