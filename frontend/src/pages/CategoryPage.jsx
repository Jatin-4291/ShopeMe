import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import QuantityCounter from "../components/QuantityCounter";
import { useUser } from "../contexts/userContext";
import { useProduct } from "../contexts/productContext";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
function CategoryPage() {
  const { id } = useParams(); // Get parent category ID from the URL
  const { user } = useUser();
  const { cartItems, setCartItems } = useProduct();
  const [childCategories, setChildCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [setQuantities] = useState({});
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedChildName, setSelectedChildName] = useState("");
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isChildCategoriesLoading, setIsChildCategoriesLoading] =
    useState(true);
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildCategories = async () => {
      setIsChildCategoriesLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/categories/${id}`
        );
        setChildCategories(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedChildId(response.data.data[0]._id);
          setSelectedChildName(response.data.data[0].name);
        }
        setIsChildCategoriesLoading(false);
      } catch (error) {
        console.error("Error fetching child categories:", error);
        setIsChildCategoriesLoading(false);
      }
    };
    fetchChildCategories();
  }, [id]);

  // Fetch products for the selected child category
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      if (selectedChildId) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/product/categoryproducts/${selectedChildId}`
          );
          setProducts(response.data.data.products);
          setIsProductsLoading(false);
        } catch (error) {
          console.error("Error fetching products:", error);
          setIsProductsLoading(false);
        }
      }
    };
    fetchProducts();
  }, [selectedChildId]);

  // Handle sorting products
  useEffect(() => {
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
    <div className="h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-row m-10 h-[calc(100vh-64px)]">
        {/* Left section: Child Categories */}
        <div className="w-1/5 bg-white border-2 border-gray-100 rounded-tl-lg p-4 overflow-y-auto scrollbar">
          {isChildCategoriesLoading ? (
            <div className="flex justify-center items-center h-full">
              <ClipLoader color={"#6D28D9"} size={50} /> {/* Violet loader */}
            </div>
          ) : (
            childCategories.map((category) => (
              <Card
                key={category._id}
                onClick={() => {
                  setSelectedChildId(category._id);
                  setSelectedChildName(category.name);
                }}
                className={`cursor-pointer md:h-20 h-10 sm:w-20 md:w-64 mb-5 ${
                  selectedChildId === category._id
                    ? "bg-violet-400"
                    : "bg-gray-200"
                }`}
              >
                <CardHeader className="flex flex-col md:flex-row items-center p-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-3 h-3 md:w-12 md:h-12 mt-2 object-cover rounded-full"
                  />
                  <CardTitle className="md:mt-0 md:ml-4 text-xs md:text-sm font-normal">
                    {category.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Right section: Products */}
        <div className="w-4/5 bg-gray-100 overflow-y-auto scrollbar">
          <div className="bg-white p-3 border rounded-md flex justify-between items-center">
            <p className="text-md font-semibold">
              Buy {selectedChildName} Online
            </p>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
            {isProductsLoading ? (
              <div className="flex justify-center items-center col-span-5">
                <ClipLoader color={"#6D28D9"} size={50} /> {/* Violet loader */}
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Card
                  key={product._id}
                  className="border border-gray-200 h-64 flex flex-col"
                >
                  <CardHeader
                    className="items-center justify-center cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
