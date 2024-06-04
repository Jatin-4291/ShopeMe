import Navbar from "../components/Navbar";
import Images from "../components/ProductDetails/Images";
import ProductsInfo from "../components/ProductDetails/ProductsInfo";
import Reviews from "../components/ProductDetails/Reviews";

function ProductDetails() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-300 w-full h-screen flex justify-center">
        <div className="bg-white w-full ml-10 mr-10 h-screen flex">
          <Images />
          <div className="w-3/5 overflow-y-auto ">
            <ProductsInfo />
            <Reviews />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
