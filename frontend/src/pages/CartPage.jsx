import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import QuantityCounter from "../components/QuantityCounter";
import { useState, useEffect } from "react";
import { useProduct } from "../contexts/productContext";
import api from "../../utils/api.js";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
function CartPage() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [error, setError] = useState(null);
  const { cartItems, setCartItems } = useProduct();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      let currentCartItems = user
        ? cartItems
        : JSON.parse(localStorage.getItem("cart")) || [];

      console.log(currentCartItems.length);

      if (currentCartItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const fetchedProducts = await Promise.all(
          currentCartItems.map(async (item) => {
            if (!item.productId) {
              console.warn("Product ID is undefined for item:", item);
              return null;
            }
            try {
              const { data } = await api.get(`/product/${item.productId}`);
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
        console.log(fetchProducts);

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
  }, [cartItems, user]);

  const handleQuantityChange = async (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
    console.log(quantities);

    if (user) {
      // If user is logged in, update the cartItems state and send the update to the server.
      const updatedCartItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);

      try {
        await api.patch(`/cart/${id}`, {
          items: updatedCartItems,
        });
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      // If no user is logged in, update only local storage.
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedStoredCart = storedCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedStoredCart));
    }

    // Calculate the updated total price
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

  const handleRemoveItem = (productId) => {
    console.log("Remove item with ID:", productId);

    const updatedCartItems = cartItems.filter(
      (item) => item.productId !== productId
    );

    setCartItems(updatedCartItems);

    if (user) {
      api
        .patch(`/cart/${id}`, {
          items: updatedCartItems,
        })
        .catch((error) =>
          console.error("Error removing item from cart:", error)
        );
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
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
    if (user) {
      try {
        const order = await api.post("/orders/", {
          userId: user._id,
          products: cartItems,
          totalAmount: totalPrice,
        });
        const myOrder = order.data.data;
        console.log(myOrder);
        navigate(`/user/orders/${user._id}`);
      } catch (error) {
        console.error("Error placing order:", error);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-200 min-h-screen p-12">
        <div className="container mx-auto flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            <div className="space-y-4">
              {loading ? (
                <ClipLoader color="#6B46C1" loading={loading} size={50} />
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

          <div className="w-full lg:w-1/3 bg-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">Price Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-violet-900 text-white py-2 rounded-md text-center block cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please Login to Order</DialogTitle>
            <DialogDescription>
              You must be logged in to place an order. Click the button below to
              log in or create an account.
            </DialogDescription>
          </DialogHeader>
          <Link
            to="/login"
            className="bg-violet-900 text-white py-2 px-4 rounded-md mt-4 block text-center"
          >
            Login
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CartPage;
