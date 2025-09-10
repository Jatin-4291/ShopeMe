/* eslint-disable react/prop-types */

import { useState } from "react";
import api from "../../utils/api";
import ReactStars2 from "react-stars";
function ReviewModal({ productId, onClose }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/review/${productId}`, {
        rating,
        review,
      });
      onClose(); // Close the modal on successful submission
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    }
  };
  const ratingChanged = (newRating) => {
    console.log(newRating);
    setRating(newRating);
  };
  return (
    <div className="mt-4 p-4 border border-s-blue-500 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Submit Your Review</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <ReactStars2
            count={5}
            onChange={ratingChanged}
            size={24}
            color2={"#388E3C"}
          />
        </div>
        <div>
          <label className="block mb-2">Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
            rows="2"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 border p-2 rounded bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="border p-2 rounded bg-blue-500 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewModal;
