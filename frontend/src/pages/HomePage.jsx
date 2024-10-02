import Boards from "../components/Homepage/Boards";
import Navbar from "../components/Navbar";
import AllCategories from "../components/Homepage/AllCategories";
import CartegoryProducts from "../components/Homepage/CartegoryProducts";
function HomePage() {
  return (
    <div>
      <Navbar className="fixed top-0 left-0 w-full z-10 bg-white shadow-md" />
      <div>
        <Boards />
        <AllCategories />
        <CartegoryProducts />
      </div>
    </div>
  );
}

export default HomePage;
