import { useState } from "react";
import iPhone13Data from "../../assets/productPageDetails";
import { FaLocationDot } from "react-icons/fa6";

function ProductsInfo() {
  const [postcode, setPostalCode] = useState(""); // Postal code state
  const [isValidPincode, setIsValidPincode] = useState();

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

  return (
    <div className="w-1/2 flex flex-col m-5">
      <h1 className="text-3xl ">{iPhone13Data.name}</h1>
      <br />
      <div className="flex">
        <div className="bg-green-700 w-6 text-white">{iPhone13Data.rating}</div>
        <h4 className="text-gray-600">
          {iPhone13Data.num_ratings} rating & {iPhone13Data.reviews} reviews
        </h4>
      </div>
      <br />
      <div className="text-3xl">${iPhone13Data.price}</div>
      <br />
      <div className="flex gap-10">
        <p>Delivery </p>
        <div className="flex border-b-2 border-black mr-3 gap-3">
          <FaLocationDot />
          <input
            type="search"
            className="outline-none"
            placeholder={`Enter Delivery Code`}
            value={postcode} // Bind value to the postal code state
            onChange={handlePostalCodeChange} // Handle changes in the input
          />
          <button onClick={handleCheckClick}>Check</button>
        </div>
      </div>
      {postcode && !isValidPincode && (
        <div className="text-red-600">enter a valid pincode</div>
      )}
      {postcode && isValidPincode && (
        <div className="text-blue-500">
          Delivery by{" "}
          {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </div>
      )}
      <br />
      <div className="">{iPhone13Data.description}</div>
    </div>
  );
}

export default ProductsInfo;
