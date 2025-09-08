import React from "react";

const QuantityCounter = ({ quantity, onQuantityChange }) => {
  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="bg-violet-900 w-6 h-6 rounded-full border text-white flex items-center justify-center"
        onClick={handleDecrease}
      >
        <p className="text-lg">-</p>
      </button>
      <span className="px-4 text-lg">{quantity}</span>
      <button
        className="bg-violet-900 w-6 h-6 rounded-full border text-white flex items-center justify-center"
        onClick={handleIncrease}
      >
        <p className="text-lg">+</p>
      </button>
    </div>
  );
};

export default QuantityCounter;
