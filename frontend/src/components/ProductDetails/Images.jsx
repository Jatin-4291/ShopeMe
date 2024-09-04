import { useEffect, useState } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { useProduct } from "../../contexts/productContext";
import { useUser } from "../../contexts/userContext";
function Images({ id }) {
  const { cartItems, setCartItems, setCartId } = useProduct();
  const { user } = useUser();
  const [images, setImages] = useState([]);
  const [imageState, setImageState] = useState(null);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/product/${id}`
        );
        const imagesData = response.data.data.doc.images;
        setImages(imagesData);
        if (imagesData.length > 0) {
          setImageState(imagesData[0]);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getProductById();
  }, [id]);

  useEffect(() => {
    if (images.length > 0) {
      setImageState(images[currentIndex]);
    }
  }, [currentIndex, images]);

  const handleSwipe = (direction) => {
    if (direction === "Left") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else if (direction === "Right") {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("Left"),
    onSwipedRight: () => handleSwipe("Right"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleAddToCart = async () => {
    if (user) {
      const userId = user._id;
      try {
        // Call the backend to add or update the item in the cart
        const cart = await axios.post(
          `http://127.0.0.1:8000/api/v1/cart/`, // Adjust the endpoint as needed
          {
            userId,
            productId: id, // Pass the product ID to add/update
          }
        );
        console.log(cart);

        // Fetch the updated cart items
        const updatedCartResponse = await axios.get(
          `http://127.0.0.1:8000/api/v1/cart/user/${userId}`
        );
        setCartItems(updatedCartResponse.data.data.cart.items);
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      console.warn("User is not logged in");
    }
  };
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex flex-col md:flex-row" {...handlers}>
        {/* Mobile swipe view */}
        <div className="flex w-full p-2 overflow-hidden md:hidden">
          {imageState && (
            <img
              className="w-full object-cover"
              src={imageState.url}
              alt="Selected"
            />
          )}
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex md:flex-col md:w-1/5 mb-5">
          <div className="flex flex-wrap justify-center md:justify-start">
            {images.map((image, index) => (
              <div
                onClick={() => setImageState(image)}
                key={index}
                className="m-1 border border-solid border-gray-300 cursor-pointer"
                style={{ width: "100px", height: "100px" }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={image.url}
                  alt={`Thumbnail ${index}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center md:justify-start w-full md:w-2/3 mb-5">
          {imageState ? (
            <img
              className="w-full max-w-full max-h-[800px] object-cover"
              src={imageState.url}
              alt="Selected"
            />
          ) : (
            <div className="w-full max-w-full max-h-80 flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
        </div>
      </div>
      <div className=" flex flex-col md:flex-row justify-between gap-5">
        <button
          onClick={handleAddToCart}
          className="w-4/5 md:w-1/2 py-2 px-4 border border-b-2 rounded mb-2 md:mb-0"
        >
          ADD TO CART
        </button>
        <button className="w-4/5 md:w-1/2 bg-violet-900 text-white py-2 px-4 rounded">
          BUY NOW
        </button>
      </div>
    </div>
  );
}

export default Images;
