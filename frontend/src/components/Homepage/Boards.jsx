import api from "../../../utils/api.js";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader from react-spinners

function Boards() {
  const [boards, setBoards] = useState([]); // Set initial state as an array
  const [setCurrentIndex] = useState(0); // Add currentIndex state
  const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
  const navigate = useNavigate(); // Correct usage of useNavigate
  const { user } = useUser();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get("/homepage/boards");
        setBoards(response.data.data.doc);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching boards:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };
    fetchBoards();
  }, []); // Add empty dependency array to run useEffect only once

  const handleOpenBoardProduct = (event, id) => {
    event.stopPropagation(); // Stop the event from propagating
    if (user) {
      navigate(`/user/productDetails/${id}`);
    } else {
      navigate(`/productDetails/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#5B21B6" size={50} />{" "}
        {/* Violet-900 color (#5B21B6) */}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <Carousel
        className="w-full mx-auto m-5" // Add mx-auto for centering and set width
        onSelect={(index) => setCurrentIndex(index)}
      >
        <CarouselContent className="h-80 md:h-96">
          {/* Set height for mobile and larger screens */}
          {boards.map((board) => (
            <CarouselItem key={board._id}>
              <Card className="overflow-hidden rounded-2xl shadow-xl hover:shadow-3xl transition-shadow duration-300">
                <CardContent
                  className="p-0 cursor-pointer" // Add cursor-pointer for clickable effect
                  onClick={(event) =>
                    handleOpenBoardProduct(event, board.productId)
                  }
                >
                  <img
                    src={board.image}
                    alt={`Board ${board._id}`}
                    className="w-full h-full object-cover rounded-2xl shadow-lg" // Adjust for full width and height
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-violet-500 text-white hover:bg-violet-600" />
        <CarouselNext className="right-4 bg-violet-500 text-white hover:bg-violet-600" />
      </Carousel>
    </div>
  );
}

export default Boards;
