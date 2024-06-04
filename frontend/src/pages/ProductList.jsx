import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Filters from "../components/Filters";
function ProductList() {
  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100">
        <Filters className="w-1/3" />
        <Products className="flex-grow" />
      </div>
    </>
  );
}

export default ProductList;
