const CustomerReviewsSection = ({ customerReviews }) => (
  <div className="overview-section">
    <h3>Recent Customer Reviews</h3>
    <ul>
      {customerReviews.map((review) => (
        <li key={review._id}>
          <p>Product: {review.productId.name}</p>
          <p>Customer: {review.userId.name}</p>
          <p>Rating: {review.rating}</p>
          <p>Comment: {review.comment}</p>
        </li>
      ))}
    </ul>
  </div>
);
