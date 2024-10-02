import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Boards() {
  const [boards, setBoards] = useState([]); // Set initial state as an array
  const [currentIndex, setCurrentIndex] = useState(0); // Add currentIndex state

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/homepage/boards"
        );
        setBoards(response.data.data.doc);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchBoards();
  }, []); // Add empty dependency array to run useEffect only once

  return (
    <div className="flex justify-center items-center">
      <Carousel
        className="w-full mx-auto m-5" // Add mx-auto for centering and set width
        onSelect={(index) => setCurrentIndex(index)}
      >
        <CarouselContent className="h-80 md:h-96">
          {" "}
          {/* Set height for mobile and larger screens */}
          {boards.map((board) => (
            <CarouselItem key={board._id}>
              <Card className="overflow-hidden rounded-2xl shadow-xl hover:shadow-3xl transition-shadow duration-300">
                <CardContent className="p-0">
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
