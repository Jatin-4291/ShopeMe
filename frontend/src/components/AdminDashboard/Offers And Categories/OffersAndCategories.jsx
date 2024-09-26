import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";

function OffersAndCategories() {
  const [boards, setBoards] = useState([]);

  // Fetch boards data from the backend
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/v1/homepage/boards"
        );
        setBoards(res.data.data.doc); // Adjust response based on your API structure
      } catch (err) {
        console.error(err);
      }
    };

    fetchBoards();
  }, []);

  // Delete board
  const deleteBoard = async (boardId) => {
    try {
      await axios.delete(`/api/boards/${boardId}`); // Replace with your delete API endpoint
      setBoards(boards.filter((board) => board._id !== boardId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-violet-900">
        Offers and Categories
      </h1>

      <div className="relative">
        <div className="flex justify-center" style={{ overflow: "hidden" }}>
          <Carousel className="w-[1000px] h-96">
            <CarouselContent className="h-96">
              {boards.map((board) => (
                <CarouselItem key={board._id}>
                  <div className="">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="flex aspect-auto items-center justify-center">
                        <img
                          src={board.image} // Ensure board.image is the correct path to your image
                          alt={`Board ${board._id}`} // Add an alt attribute for accessibility
                          className="w-full h-80 rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="mr-14 text-violet-900" />
            <CarouselNext className="text-violet-900" />
          </Carousel>
          <div className="text-center mt-2">
            <button
              onClick={() => deleteBoard(board._id)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-0 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffersAndCategories;
