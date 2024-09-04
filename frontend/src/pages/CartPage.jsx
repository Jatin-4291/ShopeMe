import { Link, useNavigate } from "react-router-dom"; // Import Link
import Navbar from "../components/Navbar";
import QuantityCounter from "../components/QuantityCounter";
import { useState, useEffect } from "react";
import { useProduct } from "../contexts/productContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { FaPlus } from "react-icons/fa6";
function CartPage() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [error, setError] = useState(null);
  const { cartItems, setCartItems } = useProduct();
  const { id } = useParams(); // Extract cartId from URL params
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const fetchedProducts = await Promise.all(
          cartItems.map(async (item) => {
            if (!item.productId) {
              console.warn("Product ID is undefined for item:", item);
              return null;
            }
            try {
              const { data } = await axios.get(
                `http://127.0.0.1:8000/api/v1/product/${item.productId}`
              );
              return { ...data.data.doc, quantity: item.quantity };
            } catch (error) {
              console.error(
                "Error fetching product with ID:",
                item.productId,
                error
              );
              return null;
            }
          })
        );

        const validProducts = fetchedProducts.filter(
          (product) => product !== null
        );
        setProducts(validProducts);

        const total = validProducts.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );
        setTotalPrice(total);

        const initialQuantities = validProducts.reduce((acc, product) => {
          acc[product._id] = product.quantity;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while fetching the products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cartItems]); // Dependency on cartItems

  const handleQuantityChange = async (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));

    const updatedCartItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/v1/cart/${id}`,
        {
          items: updatedCartItems,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error updating cart:", error);
    }

    const updatedTotalPrice = products.reduce(
      (acc, product) =>
        acc +
        (product._id === productId
          ? product.price * newQuantity
          : product.price * product.quantity),
      0
    );
    setTotalPrice(updatedTotalPrice);
  };

  const handleRemoveItem = async (productId) => {
    console.log("Remove item with ID:", productId);

    const updatedCartItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    setCartItems(updatedCartItems);

    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/cart/${id}`, {
        items: updatedCartItems,
      });
      console.log("Item removed successfully");
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }

    const updatedProducts = products.filter(
      (product) => product._id !== productId
    );

    const updatedTotalPrice = updatedProducts.reduce(
      (acc, product) => acc + product.price * (quantities[product._id] || 1),
      0
    );
    setProducts(updatedProducts);
    setTotalPrice(updatedTotalPrice);
  };
  const handlePlaceOrder = async () => {
    console.log(cartItems);
    const order = await axios.post("http://127.0.0.1:8000/api/v1/orders/", {
      userId: user._id,
      products: cartItems,
      totalAmount: totalPrice,
    });
    const myOrder = order.data.data;
    console.log(myOrder);

    Navigate(`/user/orders/${user._id}`);
  };
  return (
    <div>
      <Navbar />
      <div className="bg-gray-200 min-h-screen p-12">
        <div className="container mx-auto flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cart Items */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : products.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                products.map((product) => (
                  <div
                    className="flex items-center border-b border-gray-300 pb-4 mb-4"
                    key={product._id}
                  >
                    <img
                      className="w-20 h-20 object-cover"
                      src={product.images[0].url}
                      alt={product.name}
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-500">
                        Price: ${product.price.toFixed(2)}
                      </p>
                      <QuantityCounter
                        quantity={quantities[product._id] || 1}
                        onQuantityChange={(newQuantity) => {
                          handleQuantityChange(product._id, newQuantity);
                        }}
                      />
                    </div>
                    <button
                      className="text-red-500 font-medium ml-4"
                      onClick={() => handleRemoveItem(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Price Details */}

          <div className="w-full lg:w-1/3 bg-gray-100 p-6">
            <div className="w-full bg-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4">Address</h2>
              {user.address ? (
                <div className="w-full h-auto border border-b-2 mt-4 p-2 rounded-lg">
                  <h2 className="text-lg font-semibold">Current Address</h2>
                  <div className="flex gap-10 text-md font-semibold mt-4">
                    <h1>
                      {user.firstName} {user.lastName}
                    </h1>
                    <h1>{user.mobileNumber}</h1>
                  </div>
                  <p className="mt-2">
                    {user.address.hNo},{user.address.street},{user.address.area}
                    ,{user.address.district} {user.address.state},
                    {user.address.pincode},{user.address.landmark}
                  </p>
                </div>
              ) : (
                <button
                  // onClick={handleAddAddress}
                  className="mt-2 ml-6 text-violet-900 border border-none"
                >
                  <Link to="/user/profile" className="flex gap-3">
                    <span>
                      <FaPlus className="mt-1" />
                    </span>
                    ADD A NEW ADDRESS
                  </Link>
                </button>
              )}
            </div>
            <div className="w-full bg-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4">Price Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>$0.00</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <d
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-violet-900 text-white py-2 rounded-md text-center block cursor-pointer"
              >
                Place Order
              </d>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
