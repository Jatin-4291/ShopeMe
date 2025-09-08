import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProduct } from "../contexts/productContext";
// Import necessary components (adjust imports based on your actual component library or code)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuantityCounter from "../components/QuantityCounter"; // Assuming you have this component
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import ClipLoader from "react-spinners/ClipLoader";
function SubCategoryProducts() {
  const { id } = useParams(); // Destructure the id (make sure your route uses /:id)
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [setQuantities] = useState({});
  const { cartItems, setCartItems } = useProduct();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  // Fetch products based on category ID
  // Fetch products based on category ID
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/product/categoryproducts/${id}`
        );
        setProducts(response.data.data.products);
        setLoading(false); // Set loading to false after fetching is complete
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false on error
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  useEffect(() => {
    // Sorting logic based on sortOption
    if (sortOption === "priceAsc") {
      setProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => a.price - b.price)
      );
    } else if (sortOption === "priceDesc") {
      setProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => b.price - a.price)
      );
    } else if (sortOption === "nameAsc") {
      setProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else if (sortOption === "nameDesc") {
      setProducts((prevProducts) =>
        [...prevProducts].sort((a, b) => b.name.localeCompare(a.name))
      );
    }
  }, [sortOption]);

  const handleAdd = async (productId) => {
    if (user) {
      const userId = user._id;
      await axios.post(`http://127.0.0.1:8000/api/v1/cart/`, {
        userId,
        productId,
        quantity: 1,
      });
      const updatedCartResponse = await axios.get(
        `http://127.0.0.1:8000/api/v1/cart/user/${userId}`
      );
      setCartItems(updatedCartResponse.data.data.cart.items);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({
        productId,
        quantity: 1,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    console.log(newQuantity);

    setQuantities((prevQuantities) => {
      console.log(prevQuantities);

      const updatedQuantities = { ...prevQuantities };
      if (newQuantity <= 0) {
        delete updatedQuantities[productId];
      } else {
        updatedQuantities[productId] = newQuantity;
      }
      console.log(updatedQuantities);

      return updatedQuantities;
    });

    if (user) {
      const userId = user._id;
      try {
        if (newQuantity > 0) {
          console.log(newQuantity);
          const res = await axios.post(`http://127.0.0.1:8000/api/v1/cart/`, {
            userId,
            productId,
            quantity: newQuantity,
          });
          console.log(res);
        } else {
          await axios.delete(`http://127.0.0.1:8000/api/v1/cart/${productId}`);
        }

        const updatedCartResponse = await axios.get(
          `http://127.0.0.1:8000/api/v1/cart/user/${userId}`
        );
        console.log(updatedCartResponse);

        setCartItems(updatedCartResponse.data.data.cart.items);
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex(
        (item) => item.productId === productId
      );

      if (newQuantity > 0) {
        if (existingItemIndex >= 0) {
          cart[existingItemIndex].quantity = newQuantity;
        } else {
          cart.push({
            productId,
            quantity: newQuantity,
          });
        }
      } else if (existingItemIndex >= 0) {
        cart.splice(existingItemIndex, 1);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };
  const getQuantity = (productId) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };
  const handleClick = (id) => {
    if (!user) {
      navigate(`/productDetails/${id}`);
    } else {
      navigate(`/user/productDetails/${id}`);
    }
  };
  return (
    <div>
      <Navbar />

      <div className="w-full overflow-y-auto scrollbar p-4">
        <div className="bg-white p-3 border rounded-md flex justify-between items-center">
          <p className="text-md font-semibold">Buy Products Online</p>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-1 rounded-md text-sm"
          >
            <option value="default">Sort By</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#7c3aed" />{" "}
            {/* Adjust the size and color as needed */}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
            {products.length > 0 ? (
              products.map((product) => (
                <Card
                  key={product._id}
                  className="border border-gray-200 h-64 flex flex-col"
                >
                  <CardHeader
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => handleClick(product._id)}
                  >
                    <img
                      src={product.images[0]?.url} // Optional chaining to avoid errors
                      alt={product.name}
                      className="w-12 h-12 md:w-24 md:h-24 object-cover rounded-lg mt-2"
                    />
                    <CardTitle className="mt-2 md:mt-0 md:ml-4 text-sm font-semibold text-left">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center mt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-medium font-semibold">
                        ${product.price}
                      </p>
                      {getQuantity(product._id) ? (
                        <QuantityCounter
                          quantity={getQuantity(product._id)}
                          onQuantityChange={(newQuantity) =>
                            handleQuantityChange(product._id, newQuantity)
                          }
                        />
                      ) : (
                        <button
                          onClick={() => handleAdd(product._id)}
                          className="text-violet-900 font-semibold border px-3 border-solid rounded-md hover:bg-violet-900 hover:text-white"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No products available for this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubCategoryProducts;
