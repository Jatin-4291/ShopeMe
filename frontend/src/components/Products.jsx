// import products from "../assets/fakeproducts";
// import SortBox from "./SortBox";
import { useProduct } from "../contexts/productContext";
import axios from "axios";
import { useEffect, useState } from "react";
function Products() {
  const { searchProduct } = useProduct();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchProductByName = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/product/search/${encodeURIComponent(
            searchProduct
          )}`
        );
        setProducts(response.data.data.products);
      } catch (error) {
        setError(error);
      }
    };
    fetchProductByName();
  }, [searchProduct, setProducts]);
  console.log(error);
  console.log(products);
  return (
    <div className="m-4 bg-white w-full ">
      {/* <SortBox /> */}
      {products.map((product, index) => (
        <div className="ml-2 flex w-full border border-solid " key={index}>
          <div className="w-1/4">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="flex flex-col w-1/2 ">
            <div className="text-2xl font-bold-md">{product.name}</div>
            <br />
            <div className="flex">
              <div className="bg-green-600 w-7 text-white text-center">
                {product.rating}
              </div>
              <div className="text-gray-500 text-xs text-center">
                {product.num_ratings}Ratings & {product.reviews}Rewies
              </div>
            </div>
            <br />
            <div className="flex gap-2">
              <div className="p-2">{product.description}</div>
            </div>
          </div>
          <div className="flex justify-center items-center ">
            <div className="w-1/3 text-3xl">${product.price}</div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Products;
