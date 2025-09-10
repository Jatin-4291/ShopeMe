import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { useProduct } from "../contexts/productContext";
import { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader
import api from "../utils/api";
function Navbar() {
  const [search, setSearch] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const { isAuthenticated, user, isPhoto, setIsPhoto } = useUser();
  const { setSearchProduct, cartItems, setCartItems } = useProduct();
  const [cartId, setCartId] = useState();
  const [suggestions, setSuggestions] = useState([]); // State for search suggestions
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) return;
    if (user.photo) {
      setIsPhoto(true);
    }
  }, [user, setIsPhoto]);

  useEffect(() => {
    if (user !== null) {
      const fetchCart = async () => {
        try {
          const userId = user._id;
          const updatedCartResponse = await api.get(`/cart/user/${userId}`);
          setCartId(updatedCartResponse.data.data.cart._id);
          setCartItems(updatedCartResponse.data.data.cart.items);
        } catch (error) {
          console.error("Error fetching cart:", error.message);
        }
      };

      fetchCart();
    }
  }, [user, setCartItems]);

  const Notification = user
    ? cartItems.reduce((accumulator, item) => {
        return accumulator + item.quantity;
      }, 0)
    : (() => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        return localCart.reduce((accumulator, item) => {
          return accumulator + item.quantity;
        }, 0);
      })();

  const handleSearchProduct = async (e) => {
    setSearch(e.target.value);

    // Fetch product suggestions when the search input changes
    if (e.target.value) {
      setLoading(true); // Start loading
      try {
        const response = await api.get(`/product/search/${e.target.value}`);
        console.log(response.data.data.products);
        setSuggestions(response.data.data.products); // Assuming the API returns products in this structure
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchProduct(search);
    if (user) {
      navigate("/user/productList");
    } else {
      navigate("/productList");
    }
  };

  const handleSuggestionClick = (product) => {
    setSearch(product.name); // Set the search input to the clicked product name
    setSearchProduct(product.name);
    setSuggestions([]);
    navigate(user ? "/user/productList" : "/productList");
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 white border border-solid shadow-md text-black">
      <Link to={user ? "/user" : "/"} className="text-3xl font-bold">
        <span className="text-violet-900">Apni</span>
        <span className="text-yellow-400">Dukan</span>
      </Link>
      <form onSubmit={handleSubmit} className="flex relative">
        <input
          onChange={handleSearchProduct}
          value={search}
          type="search"
          className="w-[600px] h-12 border rounded-lg px-2 mr-1 text-black outline-none"
          placeholder="Search for products"
        />
        <CiSearch className="w-10 h-10" />
        {loading ? ( // Show loader when loading
          <div className="absolute z-10 w-[600px] flex items-center justify-center h-12">
            <ClipLoader color="#4A90E2" loading={loading} size={30} />
          </div>
        ) : (
          suggestions.length > 0 && (
            <div className="absolute z-10 w-[600px] bg-white border border-gray-300 rounded-lg shadow-lg mt-14">
              {suggestions.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="p-4 gap-5 hover:bg-gray-100 cursor-pointer flex"
                >
                  <img className="w-5 h-5" src={product.images[0].url} alt="" />
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
          )
        )}
      </form>
      {!isAuthenticated && (
        <div className="flex gap-2 items-center">
          <Link
            to="/signup"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-1.5 px-3 rounded-lg transition duration-300 ease-in-out"
          >
            Signup
          </Link>

          <Link
            to="/login"
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Login
          </Link>
        </div>
      )}
      <div className="flex gap-4">
        <Link
          to={user ? `/user/cart/${cartId || ""}` : "/cart"}
          className="relative flex gap-1 bg-violet-900 text-white border rounded-lg p-2 px-3"
        >
          <BsCart3 className="w-5 h-5 mt-1" />
          <span className="text-md mt-1">Cart</span>
          {Notification > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {Notification}
            </span>
          )}
        </Link>
        {user != null && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            {isPhoto ? (
              <div className="flex">
                <img
                  className="border border-gray-300 rounded-full object-cover w-8 h-8"
                  src={user.photo}
                  alt="Profile"
                />

                <span className="text-md mt-1">Profile</span>
              </div>
            ) : (
              <div className="flex gap-1 mt-1">
                <CiUser className="w-8 h-8" />
                <span className="text-md mt-1.5">Profile</span>
              </div>
            )}
            {isHovering && (
              <div className="w-40 absolute z-10 right-2 top-full bg-white text-black shadow-lg rounded-md mb-4">
                <Link
                  to={user ? "/user/profile" : "/profile"}
                  className="block py-2 text-black hover:bg-gray-200"
                >
                  <div className="flex items-center ml-2">
                    <CiUser className="font-light w-6 h-6" />
                    <p className="text-md ml-2">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/wishlist"
                  className="block py-2 text-black hover:bg-gray-200"
                >
                  <div className="flex items-center ml-2">
                    <AiOutlineHeart className="font-light w-6 h-6" />
                    <p className="text-md ml-2">Wishlist</p>
                  </div>
                </Link>
                <Link
                  to={`/user/orders/${user?._id}`}
                  className="block py-2 text-black hover:bg-gray-200"
                >
                  <div className="flex items-center ml-2">
                    <FaBoxOpen className="font-light w-6 h-6" />
                    <p className="text-md ml-2">Orders</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
