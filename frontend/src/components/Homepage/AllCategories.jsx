import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import ShadCN card components
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

function AllCategories() {
  const [parentCategories, setParentCategories] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

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

  const handleCategoryPage = (event, id) => {
    event.stopPropagation(); // Stop the event from propagating
    if (user) {
      navigate(`/user/categorypage/${id}`);
    } else {
      navigate(`/categorypage/${id}`);
    }
  };

  return (
    <div className="p-2 px-4">
      <div className="grid grid-cols-10 gap-6 flex-shrink">
        {parentCategories.map((category) => (
          <Card
            onClick={(event) => handleCategoryPage(event, category._id)} // Pass the event parameter properly
            key={category._id}
            className="text-center bg-violet-50 justify-center transition-transform duration-200 hover:scale-101 cursor-pointer"
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
