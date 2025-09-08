/* eslint-disable react/prop-types */
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar"; // Assuming these components are available in ShadCN
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Assuming you have a modal component
import { Button } from "@/components/ui/button"; // Assuming you have a button component

function AllReviews({ allReviews }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  console.log(allReviews); // Check the structure of the allReviews data

  // Helper function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <Card className="p-4 h-[500px]">
      <h2 className="text-xl font-bold mb-4">All Reviews</h2>
      {/* Show only the first two reviews */}
      <div className="overflow-y-auto max-h-[450] mb-4">
        {/* Scrollable container for top reviews */}
        {allReviews.length > 0 ? (
          allReviews.slice(0, 2).map((review) => (
            <Card
              key={review.productId}
              className="p-4 border rounded-md shadow-sm mb-2"
            >
              <div className="flex items-start">
                <img
                  src={review.productImage.url}
                  alt={review.productName}
                  className="w-16 h-16 mr-4 rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-md font-semibold">
                    {review.productName}
                  </h3>
                  {renderRating(review.rating)} {/* Display rating as stars */}
                  <p className="text-gray-700">{review.review}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>

      {/* Modal to show all reviews */}
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            More Reviews
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2">
              All Reviews
            </DialogTitle>
            <DialogDescription>
              Here are all the reviews for the products.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-96">
            {/* Scrollable container for all reviews */}
            {allReviews.length > 0 ? (
              allReviews.map((review) => (
                <Card
                  key={review.productId}
                  className="p-4 border rounded-md shadow-sm mb-2"
                >
                  <div className="flex items-start mb-2">
                    <Avatar
                      src={review.productImage.url}
                      alt={review.productName}
                      className="w-16 h-16 mr-4 rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {review.productName}
                      </h3>
                      {renderRating(review.rating)}{" "}
                      {/* Display rating as stars */}
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No reviews available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AllReviews;
