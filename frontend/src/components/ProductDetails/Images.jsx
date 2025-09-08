import { useEffect, useState } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { useProduct } from "../../contexts/productContext";
import { useUser } from "../../contexts/userContext";
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";

function Images({ id }) {
  const { setCartItems } = useProduct();
  const { user } = useUser();
  const [images, setImages] = useState([]);
  const [imageState, setImageState] = useState(null);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amazonLoading, setAmazonLoading] = useState(true);
  const [flipkartLoading, setFlipkartLoading] = useState(true);
  const [productDetailsAmazon, setProductDetailsAmazon] = useState(null);
  const [productDetailsFlipkart, setProductDetailsFlipkart] = useState(null);

  useEffect(() => {
    const getProductById = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/product/${id}`
        );
        const imagesData = response.data.data.doc.images;
        setImages(imagesData);

        if (response.data.data.doc.name) {
          fetchAmazonFlipkartData(response.data.data.doc.name);
        }

        if (imagesData.length > 0) {
          setImageState(imagesData[0]);
        }
      } catch (error) {
        setError("Failed to fetch product data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProductById();
  }, [id]);

  const fetchAmazonFlipkartData = async (productName) => {
    try {
      setAmazonLoading(true);
      setFlipkartLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/product/scrapProducts/${productName}`
      );
      if (response.data.data.productDetailsAmazon) {
        const amazonPrice = response.data.data.productDetailsAmazon.price;
        setProductDetailsAmazon({
          ...response.data.data.productDetailsAmazon,
          price: amazonPrice.split(" ")[0].trim(), // Trim price after space
        });
      }
      setAmazonLoading(false);

      if (response.data.data.productDetailsFLipkart) {
        setProductDetailsFlipkart(response.data.data.productDetailsFLipkart);
      }
      setFlipkartLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAmazonLoading(false);
      setFlipkartLoading(false);
    }
  };

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
        await axios.post(`http://127.0.0.1:8000/api/v1/cart/`, {
          userId,
          productId: id,
        });

        const updatedCartResponse = await axios.get(
          `http://127.0.0.1:8000/api/v1/cart/user/${userId}`
        );
        setCartItems(updatedCartResponse.data.data.cart.items);
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex((item) => item.productId === id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          productId: id,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-6 text-base md:text-lg">
        {/* 🔼 max-w-6xl, p-6 aur text size bada kar diya */}

        {error && <div className="text-red-500 mb-4 text-lg">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#6B46C1" loading={loading} size={70} />
            {/* 🔼 loader size bada */}
          </div>
        ) : (
          <>
            {/* Image Gallery */}
            <div
              className="flex flex-col md:flex-row w-full md:w-3/4"
              {...handlers}
            >
              {/* Mobile view */}
              <div className="flex w-full p-2 overflow-hidden md:hidden">
                {imageState && (
                  <img
                    className="w-full object-cover rounded-lg"
                    src={imageState.url}
                    alt="Selected"
                  />
                )}
              </div>

              {/* Thumbnails */}
              <div className="hidden md:flex md:flex-col md:w-1/5 mb-5">
                <div className="flex flex-wrap justify-center md:justify-start">
                  {images.map((image, index) => (
                    <div
                      onClick={() => setImageState(image)}
                      key={index}
                      className="m-1 border border-solid border-gray-400 cursor-pointer hover:scale-105 transition"
                      style={{ width: "100px", height: "100px" }}
                      /* 🔼 thumbnails bigger */
                    >
                      <img
                        className="w-full h-full object-cover rounded-md"
                        src={image.url}
                        alt={`Thumbnail ${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Image */}
              <div className="hidden md:flex items-center justify-center w-full md:w-4/5 mb-5">
                {imageState ? (
                  <img
                    className="w-full max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
                    /* 🔼 bigger main image */
                    src={imageState.url}
                    alt="Selected"
                  />
                ) : (
                  <div className="w-full max-w-full max-h-96 flex items-center justify-center text-gray-500 text-lg">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Amazon & Flipkart Section */}
            <div className="flex md:w-1/5 w-full flex-col items-center md:items-start bg-white border rounded-lg p-4 md:mb-0 ml-4 shadow-md">
              {/* Amazon */}
              {amazonLoading ? (
                <ClipLoader color="#6B46C1" loading={amazonLoading} size={40} />
              ) : (
                productDetailsAmazon && (
                  <div className="flex flex-col items-center p-3">
                    <p className="font-bold text-violet-900">Amazon</p>
                    <img
                      className="w-20 h-28 object-cover rounded"
                      src={productDetailsAmazon.image}
                      alt="Amazon Product"
                    />
                    <h3 className="text-sm font-semibold text-center mt-2">
                      {productDetailsAmazon.title}
                    </h3>
                    <p className="text-md text-violet-900 font-bold mt-1">
                      {productDetailsAmazon.price}
                    </p>
                  </div>
                )
              )}

              {/* Flipkart */}
              {flipkartLoading ? (
                <ClipLoader
                  color="#6B46C1"
                  loading={flipkartLoading}
                  size={40}
                />
              ) : productDetailsFlipkart ? (
                <div className="flex flex-col items-center p-3">
                  <p className="font-bold text-blue-600">Flipkart</p>
                  <img
                    className="w-20 h-28 object-cover rounded"
                    src={productDetailsFlipkart.imageUrl}
                    alt="Flipkart Product"
                  />
                  <h3 className="text-sm font-semibold text-center mt-2">
                    {productDetailsFlipkart.title}
                  </h3>
                  <p className="text-md text-violet-900 font-bold mt-1">
                    {productDetailsFlipkart.price}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center p-3 text-gray-500 italic">
                  Flipkart product not available
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6 gap-4">
        <button
          onClick={handleAddToCart}
          className="w-full md:w-1/2 py-4 px-6 bg-white border border-black text-black rounded-lg transition-all duration-200 hover:bg-gray-200 text-lg"
        >
          ADD TO CART
        </button>
        <button className="w-full md:w-1/2 py-4 px-6 bg-violet-900 text-white rounded-lg transition-all duration-200 hover:bg-violet-700 text-lg">
          BUY NOW
        </button>
      </div>
    </div>
  );
}
Images.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Images;
