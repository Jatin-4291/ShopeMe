import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import ShadCN card components
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
function CategoryProducts() {
  const [parentCategories, setParentCategories] = useState([]);
  const [childElements, setChildElements] = useState({}); // Object to store child elements for each category
  const navigate = useNavigate();
  const { user } = useUser();

  // Fetch parent categories and their children
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/categories/parents"
        );
        const parents = response.data.data;
        setParentCategories(parents); // Set the parent categories data

        // Fetch child elements for all parent categories
        parents.forEach((category) => fetchChildElements(category._id));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch child elements for each parent category
  const fetchChildElements = async (parentId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/categories/${parentId}`
      );
      setChildElements((prev) => ({
        ...prev,
        [parentId]: response.data.data, // Add child elements for the specific parent
      }));
    } catch (error) {
      console.error(`Error fetching children for category ${parentId}:`, error);
    }
  };
  const handleOpenPage = (event, categoryId) => {
    event.stopPropagation(); // Stop the event from propagating
    if (user) {
      console.log("hello");

      navigate(`/user/subcategorypage/${categoryId}`);
    } else {
      navigate(`/subcategorypage/${categoryId}`);
    }
  };
  return (
    <div className="p-2 mt-4">
      {parentCategories.map((category) => {
        const children = childElements[category._id];

        // Render parent category only if it has child categories
        return children && children.length > 0 ? (
          <div key={category._id} className="mb-5">
            <div className="font-semibold text-xl mb-4">{category.name}</div>

            {/* Display child elements in a card layout */}
            <div className="grid grid-cols-10 gap-6 flex-shrink p-2 px-4">
              {children.map((child) => (
                <Card
                  onClick={(event) => handleOpenPage(event, child._id)}
                  key={child._id}
                  className="text-center bg-white justify-center transition-transform duration-200 hover:scale-101"
                >
                  <CardHeader className="p-0">
                    <img
                      src={child.image}
                      alt={child.name}
                      className="w-3/5 h-24 object-cover rounded-lg mx-auto transition-transform duration-300 hover:scale-105"
                    />
                  </CardHeader>
                  <CardContent className="p-2">
                    <CardTitle className="text-sm font-semibold">
                      {child.name}
                    </CardTitle>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null; // Return null if there are no child categories
      })}
    </div>
  );
}

export default CategoryProducts;
