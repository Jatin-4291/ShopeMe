import { useProduct } from "../contexts/productContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const { searchProduct, productId, setProductId } = useProduct();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
  const openProduct = (product) => {
    console.log(product);
    setProductId(product._id);
    console.log(productId);
    navigate(`/user/productDetails/${product._id}`);
  };

  return (
    <div className="container mx-auto my-8 bg-white flex justify-center">
      <div className="grid grid-cols-5 gap-4 w-4/5">
        {products.map((product, index) => (
          <div
            onClick={() => openProduct(product)}
            className="border border-solid rounded-md   p-4 "
            key={index}
          >
            <div className="w-full mb-4">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold-md mb-2">{product.name}</div>
              <div className="flex justify-between">
                <div className="text-md text-center mt-1">
                  &#8377;{product.price}
                </div>
                <button className="text-violet font-semibold border p-1 px-3 border-solid rounded-md hover:bg-violet-900 hover:text-white">
                  ADD
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
