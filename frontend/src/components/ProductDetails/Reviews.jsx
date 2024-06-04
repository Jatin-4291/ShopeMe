import ProgressBar from "@ramonak/react-progress-bar";

function Reviews() {
  const ratings = [5, 4, 3, 2, 1]; // Array to iterate over
  const fakeReviews = [
    {
      userName: "John Doe",
      rating: 5,
      review:
        "Absolutely love my new iPhone 13! The camera quality is amazing, and the battery life is impressive.",
    },
    {
      userName: "Alice Smith",
      rating: 4,
      review:
        "The iPhone 13 is a solid upgrade from my previous phone. It's fast, sleek, and the display is gorgeous.",
    },
    {
      userName: "Emily Johnson",
      rating: 5,
      review:
        "I've been using the iPhone 13 for a week now, and it's been fantastic. No complaints at all!",
    },
    {
      userName: "Michael Brown",
      rating: 3,
      review:
        "The iPhone 13 is good overall, but I expected more improvements in terms of features for the price.",
    },
    {
      userName: "Sophia Wilson",
      rating: 5,
      review:
        "The iPhone 13 exceeded my expectations. The performance is top-notch, and the design is beautiful.",
    },
    // Add more reviews as needed
  ];

  return (
    <div>
      <div className="border border-s-blue-500 m-4">
        <div className="flex justify-between mt-3">
          <h1 className="text-2xl font-medium ml-5 ">Reviews & Rating </h1>
          <button className="w-25 h-11 mr-10 border border-s-blue-500 shadow-md">
            Rate Product
          </button>
        </div>
        <div className="flex m-5 gap-4">
          <div>
            <h1 className="text-5xl">4.6</h1>
            <p className="text-gray-500 text-sm">28,00,000 Rating</p>
            <p className="text-gray-500 text-sm">47,000 Reviews</p>
          </div>
          <div>
            {ratings.map((rating, index) => (
              <div key={index} className="flex">
                <p className=""> {rating} &#9733;</p>
                <ProgressBar
                  className="m-2"
                  completed={-20}
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

        {/* reviews */}
        {fakeReviews.map((fakeReview, index) => (
          <div className="m-3 h-16 border border-solid p-2" key={index}>
            <div className="flex gap-5">
              <div className="bg-green-700 w-6 text-white text-center border rounded-md">
                {fakeReview.rating}
              </div>
              <div className="text-sm text-gray-600">{fakeReview.userName}</div>
            </div>
            <div>{fakeReview.review}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
