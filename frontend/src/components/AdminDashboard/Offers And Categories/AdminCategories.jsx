import api from "../../../../utils/api";
import { useEffect, useState } from "react";
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
import { GoPencil } from "react-icons/go";
import { FiTrash } from "react-icons/fi";

function AdminCategories() {
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parentError, setParentError] = useState("");
  const [childError, setChildError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setParentError("");
    try {
      const response = await api.get("/categories/parents");
      setParentCategories(response.data.data);
    } catch (error) {
      setParentError("Error fetching parent categories. Please try again.");
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildCategories = async (parentId) => {
    setLoading(true);
    setChildError("");
    try {
      const response = await api.get(`/categories/${parentId}`);
      setChildCategories(response.data.data);
      setSelectedParentId(parentId);
    } catch (error) {
      setChildError("Error fetching child categories. Please try again.");
      console.error("Error fetching child categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const addNewParentCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("name", categoryName);

      await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear inputs and re-fetch parent categories
      setSelectedImage(null);
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding new parent category:", err);
    }
  };

  const addNewCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("name", categoryName);
      formData.append("parentCategory", selectedParentId);

      await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear inputs and re-fetch child categories for the selected parent
      setSelectedImage(null);
      setCategoryName("");
      fetchChildCategories(selectedParentId);
    } catch (err) {
      console.error("Error adding new child category:", err);
    }
  };

  const handleEditCategory = (id) => {
    // Add logic for editing the category
    console.log(`Edit category with id: ${id}`);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      if (selectedParentId) {
        setChildCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
      } else {
        setParentCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
      }
      console.log(`Successfully deleted category with id: ${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="flex">
      {/* Violet box with parent categories */}
      <div className="w-1/6 bg-violet-100 p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Parent Categories</h2>
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : parentError ? (
            <div className="text-red-500 text-center">{parentError}</div>
          ) : (
            <>
              {parentCategories.map((category) => (
                <div
                  key={category._id}
                  className="relative mb-4 flex flex-col items-center cursor-pointer border border-transparent hover:border-violet-400 group rounded-lg p-2"
                  onClick={() => fetchChildCategories(category._id)}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-full mb-2"
                  />
                  <span className="text-sm text-gray-800">{category.name}</span>

                  {/* Hover Edit and Delete buttons */}
                  <div className="absolute top-2 right-2 hidden group-hover:flex space-x-2">
                    <button
                      className="p-1 bg-blue-500 text-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category._id);
                      }}
                    >
                      <GoPencil className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 bg-red-500 text-white rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category._id);
                      }}
                    >
                      <FiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Button at the End */}
              <div className="flex justify-center mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-violet-300 text-white rounded-lg hover:bg-violet-600 transition-colors"
                    >
                      + Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add a new Parent Category</DialogTitle>
                      <DialogDescription>
                        Add a new parent category
                      </DialogDescription>
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
                        <Label htmlFor="category-name" className="text-right">
                          Category Name
                        </Label>
                        <Input
                          id="category-name"
                          type="text"
                          placeholder="Enter category name"
                          className="col-span-3"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addNewParentCategory}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Div to display child categories */}
      <div className="flex-1 bg-gray-100 p-4 shadow-md rounded-lg ml-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : childError ? (
          <div className="text-red-500 text-center">{childError}</div>
        ) : childCategories.length > 0 ? (
          <div className="flex gap-4">
            {childCategories.map((child) => (
              <div
                key={child._id}
                className="relative flex flex-col items-center cursor-pointer border border-transparent hover:border-violet-400 group rounded-lg p-2"
              >
                <img
                  src={child.image}
                  alt={child.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
                <span className="text-sm text-gray-800">{child.name}</span>

                {/* Hover Edit and Delete buttons */}
                <div className="absolute top-2 right-2 hidden group-hover:flex space-x-2">
                  <button
                    className="p-1 bg-blue-500 text-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(child._id);
                    }}
                  >
                    <GoPencil className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 bg-red-500 text-white rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(child._id);
                    }}
                  >
                    <FiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Button at the End */}
            <div className="flex justify-center mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-violet-300 text-white rounded-lg hover:bg-violet-600 transition-colors"
                  >
                    + Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a new Child Category</DialogTitle>
                    <DialogDescription>
                      Add a new category under the selected parent.
                    </DialogDescription>
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
                      <Label htmlFor="category-name" className="text-right">
                        Category Name
                      </Label>
                      <Input
                        id="category-name"
                        type="text"
                        placeholder="Enter category name"
                        className="col-span-3"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addNewCategory}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No child categories found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
