import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Images from "../components/ProductDetails/Images";
import ProductsInfo from "../components/ProductDetails/ProductsInfo";
import Reviews from "../components/ProductDetails/Reviews";

function ProductDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 w-full h-screen flex flex-col md:flex-row">
        {/* Images Component */}
        <div className="bg-white w-full md:w-3/5 h-full flex items-center justify-center md:border md:border-solid md:m-2">
          <Images id={id} />
        </div>
        {/* ProductsInfo and Reviews Components */}
        <div className="bg-white w-full md:w-2/5 h-full overflow-y-auto md:border md:border-solid md:m-2">
          <ProductsInfo productId={id} />
          <Reviews productId={id} />
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
