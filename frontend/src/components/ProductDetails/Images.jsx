import { useState } from "react";
import images from "../../assets/productDetailsImages";

function Images() {
  const [imageState, setImageState] = useState(false);
  function handleClick(image) {
    setImageState(image);
  }
  return (
    <div className="flex flex-col w-1/2">
      <div className="flex w-full">
        <div className="flex flex-col m-5">
          {images.map((image, index) => (
            <div
              onClick={() => handleClick(image)}
              key={index}
              className="m-1 border border-solid border-1 border-gray-300"
              style={{ width: "100px", height: "100px" }}
            >
              <img className="w-4/5  object-cover" src={image} alt="" />
            </div>
          ))}
        </div>
        <div className="flex items-center ml-5 mt-5">
          {imageState == false ? (
            <img className="w-full max-w-md" src={images[0]} />
          ) : (
            <img className="w-full max-w-md" src={imageState} alt="" />
          )}
        </div>
      </div>
      <div className="mt-5">
        <button className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded">
          ADD TO CART
        </button>
        <button className="w-1/2 bg-green-500 text-white py-2 px-4 rounded mt-2">
          BUY NOW
        </button>
      </div>
    </div>
  );
}

export default Images;
