import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Filters from "../components/Filters";
function ProductList() {
  return (
    <>
      <Navbar />
      <div className="flex w-full">
        <Products className="flex justify-center w-4/5" />
      </div>
    </>
  );
}

export default ProductList;
