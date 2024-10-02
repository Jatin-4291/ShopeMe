import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import ShadCN card components

function AllCategories() {
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/categories/parents"
        );
        setParentCategories(response.data.data); // Fetch and set categories data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-2 px-4">
      <div className="grid grid-cols-10 gap-6 flex-shrink">
        {parentCategories.map((category) => (
          <Card
            key={category._id}
            className="text-center bg-violet-50 justify-center transition-transform duration-200 hover:scale-101"
          >
            <CardHeader className="p-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-4/5 h-28 object-cover rounded-t-lg mx-auto transition-transform duration-300 hover:scale-105"
              />
            </CardHeader>
            <CardContent className="p-2">
              <CardTitle className="text-sm font-semibold">
                {category.name}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AllCategories;
