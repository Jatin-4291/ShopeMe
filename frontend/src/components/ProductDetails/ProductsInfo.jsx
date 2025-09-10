/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import api from "../../utils/api.js";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

function ProductsInfo({ productId }) {
  const [postcode, setPostalCode] = useState("");
  const [isValidPincode, setIsValidPincode] = useState();
  const [product, setProduct] = useState({});
  const [setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await api.get(`/product/${productId}`);
        const data = response.data.data.doc;
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    getProductById();
  }, [productId, setError]);

  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
  };

  const handleCheckClick = () => {
    setIsValidPincode(checkPincode(postcode));
  };

  const checkPincode = (pin) => {
    const regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);
    return regex.test(pin);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color="#6B46C1" loading={loading} size={50} />{" "}
        {/* Loading Spinner */}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent">
      <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
      <div className="text-2xl font-semibold text-gray-800 mb-6">
        &#8377;{product.price}
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <p className="text-lg font-medium">Delivery</p>
        <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-2">
          <FaLocationDot className="text-xl text-gray-500" />
          <input
            type="search"
            className="flex-grow outline-none text-lg p-1"
            placeholder="Enter Delivery Code"
            value={postcode}
            onChange={handlePostalCodeChange}
          />
          <button
            onClick={handleCheckClick}
            className="bg-violet-900 text-white py-1 px-4 rounded hover:bg-violet-700 transition"
          >
            Check
          </button>
        </div>
        {postcode && !isValidPincode && (
          <div className="text-red-600 mt-2">Please enter a valid pincode.</div>
        )}
        {postcode && isValidPincode && (
          <div className="text-blue-500 mt-2">
            Delivery by{" "}
            {new Date(
              Date.now() + 10 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="text-lg text-gray-700 leading-relaxed">
        {product.description}
      </div>
    </div>
  );
}

export default ProductsInfo;
