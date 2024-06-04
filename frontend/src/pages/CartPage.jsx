import Navbar from "../components/Navbar";
import productPageDetails from "../assets/productPageDetails";
import QuantityCounter from "../components/QuantityCounter";
import { useState, useEffect } from "react";

function CartPage() {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate total price when productPageDetails changes
    const totalPrice = Math.floor(
      productPageDetails.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      )
    );
    setTotalPrice(totalPrice);
  }, [productPageDetails]);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-200 flex h-screen p-12">
        <div className="w-3/5">
          <div className="bg-white h-16 mb-5 flex justify-between">
            <h1 className="p-3">
              <span className="font-medium">Deliver To:</span> Faridabad-121005
            </h1>
            <button className="border border-s-black text-blue-500 text-sm h-8 w-15 m-3">
              Change
            </button>
          </div>
          <div className="bg-white p-2">
            {productPageDetails.map((product, index) => (
              <div className="flex m-2 p-3 items-center" key={index}>
                <div>
                  <img className="w-20 h-20" src={product.image} alt="" />
                  <QuantityCounter index={index} />
                </div>
                <div className="ml-16">
                  <h1 className="font-medium mb-2">{product.name}</h1>
                  <h1 className="font-medium">{product.price}</h1>
                </div>
                <button className=" text-gray-400 font-medium ml-32 ">
                  REMOVE PRODUCT
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/5">
          <div className="bg-white h-48 mb-5 justify-between ml-5">
            <h1 className="m-5 text-l font-medium text-gray-400">
              PRICE DETAILS
            </h1>
            <hr />
            <div className="flex m-5 justify-between">
              <h1>Price:</h1>
              <h1>{totalPrice}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
