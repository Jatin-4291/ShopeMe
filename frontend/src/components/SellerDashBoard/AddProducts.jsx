import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCategory } from "../../contexts/categoriesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

function AddProducts() {
  const { categories } = useCategory();
  const [productName, setProductName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [isParentCategoriesLoaded, setIsParentCategoriesLoaded] =
    useState(false);
  const [isChildCategoriesLoaded, setIsChildCategoriesLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/categories/parents"
        );
        setParentCategories(response.data.data);
        setIsParentCategoriesLoaded(true);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
        setErrorMessage("Failed to load parent categories.");
      }
    };
    fetchParentCategories();
  }, []);

  useEffect(() => {
    const fetchChildCategories = async () => {
      if (!selectedParentCategory) return;

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/categories/${selectedParentCategory}`
        );
        setChildCategories(response.data.data);
        setIsChildCategoriesLoaded(true);
      } catch (error) {
        console.error("Error fetching child categories:", error);
        setErrorMessage("Failed to load child categories.");
      }
    };
    fetchChildCategories();
  }, [selectedParentCategory]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("name", productName);
    formData.append(
      "category",
      selectedChildCategory || selectedParentCategory
    );
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setSelectedParentCategory("");
    setSelectedChildCategory("");
    setImages([]);
    setDescription("");
    setPrice("");
    setBrand("");
    setIsChildCategoriesLoaded(false);
    setErrorMessage("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="shadow-lg rounded-lg w-full">
        <CardHeader>
          <CardTitle className="text-violet-900">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  {isParentCategoriesLoaded ? (
                    <Select
                      id="parentCategory"
                      onValueChange={(value) => {
                        setSelectedParentCategory(value);
                        setSelectedChildCategory("");
                        setChildCategories([]);
                        setIsChildCategoriesLoaded(false);
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {parentCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Skeleton className="h-10" />
                  )}
                </div>

                {selectedParentCategory && isChildCategoriesLoaded && (
                  <div>
                    <Label htmlFor="childCategory">Child Category</Label>
                    <Select
                      id="childCategory"
                      onValueChange={(value) => setSelectedChildCategory(value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a child category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {childCategories.map((child) => (
                            <SelectItem key={child._id} value={child._id}>
                              {child.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter product price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="Enter product brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProducts;
