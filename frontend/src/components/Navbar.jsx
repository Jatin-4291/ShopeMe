import { IoCartOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import { useProduct } from "../contexts/productContext";
import { useState } from "react";

function Navbar() {
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useUser();
  const { setSearchProduct } = useProduct();
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleSearchProduct = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchProduct(search);
    navigate("/user/productList"); // Programmatically navigate to the product list
  };

  return (
    <nav className="flex items-center justify-between h-12 px-4 bg-blue-500 text-white">
      <h2 className="text-yellow-400 font-bold text-2xl">ShopMe</h2>
      <form onSubmit={handleSubmit} className="flex">
        <input
          onChange={handleSearchProduct}
          value={search}
          type="search"
          className="w-50 px-2 mr-1 text-black outline-none"
          placeholder="search for products"
        />
        <button type="submit">
          <IoSearch className="w-8 h-8" />
        </button>
      </form>
      <a href="#">Become a seller</a>
      <div className="flex gap-2">
        {isAuthenticated ? (
          <Link to="/logout" className="bg-yellow-400 h-7 w-12 text-black">
            Logout
          </Link>
        ) : (
          <Link to="/login" className="bg-yellow-400 h-7 w-12 text-black">
            Login
          </Link>
        )}
        <Link to="/signup" className="bg-yellow-400 h-7 w-14 text-black">
          SignUp
        </Link>
      </div>
      <IoCartOutline className="w-8 h-8" />
    </nav>
  );
}

export default Navbar;
