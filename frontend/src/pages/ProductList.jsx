import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Filters from "../components/Filters";
import { useProduct } from "../contexts/productContext";
function ProductList() {
  const { searchProduct } = useProduct();
  return (
    <>
      <Navbar />
      <p className="ml-20 mt-4 font-semibold text-md">
        Showing results for "{searchProduct}"
      </p>

      <Products className="flex justify-center w-full" />
    </>
  );
}

export default ProductList;
