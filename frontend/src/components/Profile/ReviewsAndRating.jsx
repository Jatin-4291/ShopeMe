import { useState, useEffect } from "react";
import api from "../../../utils/api";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

function ReviewsAndRating() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Ensure user is defined before making the request
        if (!user || !user._id) {
          setError("User ID is not available.");
          setLoading(false);
          return;
        }

        // Fetch reviews using the user ID
        const response = await api.get(`/review/user/${user._id}`);

        // Update state with the fetched reviews
        setReviews(response.data.data.reviews);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  // If the data is still loading
  if (loading) return <Skeleton />;

  // If there was an error fetching data
  if (error)
    return (
      <Alert type="error">
        <strong>Error:</strong> {error}
      </Alert>
    );

  // Handle card click to navigate to product detail page
  const handleCardClick = (productId) => {
    navigate(`/user/productDetails/${productId}`);
  };

  // Render reviews if available
  return (
    <div className="h-full overflow-hidden p-4">
      <h1 className="text-2xl font-bold mb-4 text-violet-900">User Reviews</h1>
      <div className="h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent">
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                onClick={() => handleCardClick(review.product._id)}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <Card className="border shadow-sm">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 overflow-hidden rounded-full border border-gray-300">
                        <img
                          className="w-full h-full object-cover"
                          src={review.product.images[0].url}
                          alt={review.product.name}
                        />
                      </div>
                      <CardTitle className="text-violet-900">
                        {review.product.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{review.review}</p>
                    <p className="text-sm font-medium">
                      Rating: {review.rating} / 5
                    </p>
                    <p className="text-xs text-gray-500">
                      Reviewed on{" "}
                      {new Date(review.createdAT).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsAndRating;
