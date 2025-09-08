import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importing ShadCN components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStock, setNewStock] = useState({});
  const [newPrice, setNewPrice] = useState({});
  const [editProductId, setEditProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("name");

  useEffect(() => {
    const getSellerProductsList = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/product/"
        );
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
  const handlePriceChange = (productId, value) => {
    setNewPrice((prevPrice) => ({
      ...prevPrice,
      [productId]: value,
    }));
  };

  const handleSubmit = async (product) => {
    try {
      const updatedStock =
        Number(product.stock) + Number(newStock[product._id] || 0);
      const updatedPrice = newPrice[product._id]
        ? Number(newPrice[product._id])
        : product.price;

      await axios.patch(`http://127.0.0.1:8000/api/v1/product/${product._id}`, {
        stock: updatedStock,
        price: updatedPrice,
      });

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === product._id
            ? { ...p, stock: updatedStock, price: updatedPrice }
            : p
        )
      );

      setNewStock((prevStock) => ({
        ...prevStock,
        [product._id]: "",
      }));
      setNewPrice((prevPrice) => ({
        ...prevPrice,
        [product._id]: "",
      }));

      setEditProductId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    }
  };

  const handleEditClick = (productId) => {
    setEditProductId(productId);
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/product/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">My Products</h1>
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />
        <Select onValueChange={(value) => setSearchField(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption>A list of my products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <Input
                    type="number"
                    min="0"
                    value={newPrice[product._id] || product.price}
                    onChange={(e) =>
                      handlePriceChange(product._id, e.target.value)
                    }
                    className="w-20"
                  />
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <Input
                    type="number"
                    min="0"
                    placeholder={product.stock}
                    value={newStock[product._id] || ""}
                    onChange={(e) =>
                      handleStockChange(product._id, e.target.value)
                    }
                    className="w-20"
                  />
                ) : (
                  product.stock
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <Button
                    className="bg-violet-900"
                    onClick={() => handleSubmit(product)}
                  >
                    <FaEdit />
                  </Button>
                ) : (
                  <div className="flex">
                    <Button
                      className="bg-violet-900 mr-2"
                      onClick={() => handleEditClick(product._id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      className="bg-red-500"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default MyProducts;
