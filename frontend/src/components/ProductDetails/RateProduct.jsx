import Navbar from "../Navbar";
import ReactStars from "react-rating-stars-component";

function RateProduct() {
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-200 h-screen p-1">
        <div className="bg-white h-20 m-3">
          <h1 className="p-4 text-2xl font-semibold">Ratings & Reviews</h1>
        </div>
        <div className="bg-white h-30 m-3">
          <h1 className="text-xl p-4 font-medium">Rate this Product</h1>
          <ReactStars
            classNames="px-4"
            count={5}
            onChange={ratingChanged}
            size={35}
            activeColor="#ffd700"
            color="#cccccc"
          />
        </div>
        <div className="bg-white h-30 m-3">
          <h1 className="text-xl p-4 font-medium">Review this Product</h1>
          <input
            type="text"
            className="h-40 w-4/5 ml-10 outline-slate-400 outline-1 border border-s-slate-400 mb-5  " // Apply custom class
            placeholder="Write your review"
          />
        </div>
        <div className=" h-48 p-11 m-3 bg-white flex justify-end">
          <button className="w-40 h-16 bg-orange-600 text-white text-medium text-2xl ">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateProduct;
