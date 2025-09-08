import { useProduct } from "../contexts/productContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuantityCounter from "../components/QuantityCounter"; // Ensure this is the correct import
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

function Products() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [setError] = useState("");
  const { searchProduct, setCartItems, cartItems } = useProduct(); // Add state for search product
  const [setQuantities] = useState({}); // State for product quantities
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch the current quantity from cartItems for a given product
  console.log(cartItems);

  const getQuantity = (productId) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    const fetchProductByName = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/product/search/${searchProduct}`
        );
        console.log(response);

        setProducts(response.data.data.products);
      } catch (error) {
        setError("Error fetching products.");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (searchProduct) fetchProductByName(); // Fetch only if searchProduct is not empty
  }, [searchProduct, setError]);

  const openProduct = (product) => {
    if (product && product._id) {
      const path = user
        ? `/user/productDetails/${product._id}`
        : `/productDetails/${product._id}`;
      navigate(path);
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

  return (
    <div className="w-full p-4 overflow-y-auto scrollbar flex flex-row justify-center">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <ClipLoader color="#6B46C1" loading={loading} size={50} />{" "}
          {/* Spinner */}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-screen-xl">
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product._id}
                className="border border-gray-200 h-64 flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader
                  onClick={() => openProduct(product)}
                  className="items-center justify-center cursor-pointer flex-grow"
                >
                  <img
                    src={product.images[0]?.url || ""}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <CardTitle className="mt-2 text-sm font-semibold text-left">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-between">
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
  );
}

export default Products;
