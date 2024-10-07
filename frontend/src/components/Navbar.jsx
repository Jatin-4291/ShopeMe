import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { useProduct } from "../contexts/productContext";
import { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import axios from "axios";

function Navbar() {
  const [search, setSearch] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const { isAuthenticated, user, isPhoto, setIsPhoto } = useUser();
  const { setSearchProduct, cartItems, setCartItems } = useProduct();
  const [cartId, setCartId] = useState();
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
          const updatedCartResponse = await axios.get(
            `http://127.0.0.1:8000/api/v1/cart/user/${userId}`
          );
          setCartId(updatedCartResponse.data.data.cart._id);
          setCartItems(updatedCartResponse.data.data.cart.items);
        } catch (error) {
          console.error("Error fetching cart:", error.message);
        }
      };

      fetchCart();
    }
  }, [user, setCartItems]);

  const Notification = cartItems.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);

  const handleSearchProduct = (e) => {
    setSearch(e.target.value);
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
    navigate("/user/productList");
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 white border border-solid shadow-md text-black">
      <h1 className="text-3xl font-bold">
        <span className="text-violet-900">Apni</span>
        <span className="text-yellow-400">Dukan</span>
      </h1>
      <form onSubmit={handleSubmit} className="flex">
        <input
          onChange={handleSearchProduct}
          value={search}
          type="search"
          className="w-[600px] h-12 border rounded-lg px-2 mr-1 text-black outline-none"
          placeholder="Search for products"
        />
        <CiSearch className="w-10 h-10" />
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
          to={`/user/cart/${cartId || ""}`}
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
        {user !== null && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            {isPhoto ? (
              <div className="flex">
                <img
                  src={user.photo}
                  alt="Profile"
                  className="object-cover w-8 h-8"
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
                  to="/user/profile"
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
