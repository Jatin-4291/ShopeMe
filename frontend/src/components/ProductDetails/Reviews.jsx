/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import ReviewModal from "./ReviewModal"; // Import the ReviewModal
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(true); // State for loading
  const ratings = [5, 4, 3, 2, 1];

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/review/${productId}`
        );

        const fetchedReviews = response.data.data.reviews;
        setReviews(fetchedReviews);

        const totalRating = fetchedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(
          fetchedReviews.length
            ? (totalRating / fetchedReviews.length).toFixed(1)
            : 0
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchReviews();
  }, [productId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color="#6B46C1" loading={loading} size={50} />{" "}
        {/* Loading Spinner */}
      </div>
    );
  }

  return (
    <div>
      <div className="border border-s-blue-500 m-4">
        <div className="flex justify-between mt-3">
          <h1 className="text-2xl font-medium ml-5">Reviews & Rating</h1>
          <button
            onClick={openModal}
            className="w-25 h-11 mr-10 border border-s-blue-500 shadow-md"
          >
            Rate Product
          </button>
        </div>
        <div className="flex m-5 gap-4">
          <div>
            <h1 className="text-5xl">{averageRating}</h1>
            <p className="text-gray-500 text-sm">{reviews.length} Ratings</p>
            <p className="text-gray-500 text-sm">{reviews.length} Reviews</p>
          </div>
          <div>
            {ratings.map((rating, index) => (
              <div key={index} className="flex">
                <p>{rating} &#9733;</p>
                <ProgressBar
                  className="m-2"
                  completed={
                    (reviews.filter((review) => review.rating === rating)
                      .length /
                      reviews.length) *
                    100
                  }
                  width={100}
                  height={5}
                  isLabelVisible={false}
                  bgColor={"#43A047"}
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {reviews.map((review, index) => (
          <div className="m-3 h-16 border border-solid p-2" key={index}>
            <div className="flex gap-5">
              <div className="bg-green-700 w-6 text-white text-center border rounded-md">
                {review.rating}
              </div>
              <div className="text-sm text-gray-600">{review.user.name}</div>
            </div>
            <div>{review.review}</div>
          </div>
        ))}

        {/* Modal for submitting reviews */}
        {isModalOpen && (
          <ReviewModal productId={productId} onClose={closeModal} />
        )}
      </div>
    </div>
  );
}

export default Reviews;
