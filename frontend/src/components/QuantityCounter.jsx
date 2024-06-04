import PropTypes from "prop-types";
import { useState } from "react";
import productPageDetails from "../assets/productPageDetails";
function QuantityCounter({ index }) {
  const [quantities, setQuantities] = useState(
    Array(productPageDetails.length).fill(1)
  );
  const handleIncrement = (index) => {
    setQuantities((prevQuantities) => {
      productPageDetails[index].quantity++;
      console.log(productPageDetails[index].quantity);
      const newQuantities = [...prevQuantities];
      newQuantities[index]++;
      return newQuantities;
    });
  };

  const handleDecrement = (index) => {
    setQuantities((prevQuantities) => {
      if (productPageDetails[index] > 1) {
        productPageDetails[index].quantity--;
      }
      const newQuantities = [...prevQuantities];
      if (newQuantities[index] > 0) {
        newQuantities[index]--;
      }
      return newQuantities;
    });
  };
  return (
    <div className="mt-3 flex">
      <button
        onClick={() => handleDecrement(index)}
        className="bg-blue-500 w-5 h-5 text-white rounded-full flex justify-center items-center"
      >
        -
      </button>
      <h1 className="w-10 text-center">{quantities[index]}</h1>
      <button
        onClick={() => handleIncrement(index)}
        className="bg-blue-500 w-5 h-5 text-white rounded-full flex justify-center items-center"
      >
        +
      </button>
    </div>
  );
}

QuantityCounter.propTypes = {
  index: PropTypes.number.isRequired,
};

export default QuantityCounter;
