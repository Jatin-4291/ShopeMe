import { useState, useEffect } from "react";
import api from "../../../../utils/api.js";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Offers() {
  const [boards, setBoards] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(false); // New loader state

  useEffect(() => {
    const fetchBoardsAndProducts = async () => {
      setLoading(true); // Set loading true when fetching data
      try {
        const resBoards = await api.get("/homepage/boards");
        const resProducts = await api.get("/product/getAll");
        setBoards(resBoards.data.data.doc);
        setProducts(resProducts.data.data.doc);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    fetchBoardsAndProducts();
  }, []);

  const deleteBoard = async (boardId) => {
    setLoading(true);
    try {
      await api.delete(`/admin/boards/${boardId}`);
      setBoards(boards.filter((board) => board._id !== boardId));
    } catch (err) {
      console.error("Error deleting board:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNewBoard = async () => {
    if (!selectedImage || !selectedProduct) {
      alert("Please select an image and a product.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("productId", selectedProduct);

    setLoading(true);
    try {
      const res = await api.post("/admin/boards", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBoards([...boards, res.data.data.doc]);
      setSelectedImage(null);
      setSelectedProduct("");
    } catch (err) {
      console.error("Error adding board:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div>
      <div className="relative max-w-4xl mx-auto mt-4">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        )}

        <Carousel
          className="w-full"
          onSelect={(index) => setCurrentIndex(index)}
        >
          <CarouselContent className="h-96">
            {boards.map((board) => (
              <CarouselItem key={board._id}>
                <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <img
                      src={board.image}
                      alt={`Board ${board._id}`}
                      className="w-full h-96 object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-violet-500 text-white hover:bg-violet-600" />
          <CarouselNext className="right-4 bg-violet-500 text-white hover:bg-violet-600" />
        </Carousel>

        <div className="flex justify-center items-center space-x-4 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-100 text-violet-900 hover:text-violet-600 font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a new Board</DialogTitle>
                <DialogDescription>Add a new offer board</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image-upload" className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 w-full"
                    >
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <span>Click to select an image</span>
                      )}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product-select" className="text-right">
                    Product
                  </Label>
                  <Select onValueChange={(value) => setSelectedProduct(value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addNewBoard}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() =>
              boards[currentIndex] && deleteBoard(boards[currentIndex]._id)
            }
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            Delete Current Board
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Offers;
