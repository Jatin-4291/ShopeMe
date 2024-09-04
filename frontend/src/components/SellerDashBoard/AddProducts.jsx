import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCategory } from "../../contexts/categoriesContext";

function AddProducts() {
  const { categories, setCategories } = useCategory();
  const [productName, setProductName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [variants, setVariants] = useState([
    { variantName: "", variantValue: "" },
  ]);
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  console.log(categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/categories"
        );
        const data = response.data.data.doc;
        console.log(data);

        const categoryMap = new Map();
        data.forEach((category) => {
          categoryMap.set(category._id, category);
        });

        const transformedCategories = [];
        const parentMap = new Map();

        data.forEach((category) => {
          if (category.parentCategory) {
            if (!parentMap.has(category.parentCategory)) {
              parentMap.set(category.parentCategory, {
                parent: categoryMap.get(category.parentCategory),
                children: [],
              });
            }
            parentMap.get(category.parentCategory).children.push(category);
          } else {
            transformedCategories.push({ parent: category, children: [] });
          }
        });

        transformedCategories.forEach((parentCategory) => {
          if (parentMap.has(parentCategory.parent._id)) {
            parentCategory.children = parentMap.get(
              parentCategory.parent._id
            ).children;
          }
        });

        setCategories(transformedCategories);
        setIsCategoriesLoaded(true);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setCategories]);
  console.log(isCategoriesLoaded);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...variants];
    newVariants[index][e.target.name] = e.target.value;
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { variantName: "", variantValue: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", productName);
    formData.append(
      "category",
      selectedChildCategory ? selectedChildCategory : selectedParentCategory
    );
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);

    axios
      .post("http://127.0.0.1:8000/api/v1/products/", formData)
      .then((response) => {
        console.log("Product added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  return (
    <div className="flex flex-col bg-gray-50">
      <h2 className="text-2xl font-bold mb-2 text-violet-900">
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-3 shadow-lg rounded-lg flex-1 overflow-auto"
      >
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-900"
              required
            />
          </div>

          {/* Parent Category Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            {isCategoriesLoaded ? (
              <select
                value={selectedParentCategory}
                onChange={(e) => {
                  setSelectedParentCategory(e.target.value);
                  setSelectedChildCategory(""); // Reset child selection
                }}
                className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-900"
                required
                disabled={!isCategoriesLoaded}
              >
                {categories.map((category) => (
                  <option key={category.parent._id} value={category.parent._id}>
                    {category.parent.name}
                  </option>
                ))}
              </select>
            ) : (
              <div>Loading...</div>
            )}
          </div>
          {selectedParentCategory && isCategoriesLoaded && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Child Category
              </label>
              <select
                value={selectedChildCategory}
                onChange={(e) => setSelectedChildCategory(e.target.value)}
                className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-900"
                required
              >
                <option value="">Select a child category</option>
                {categories
                  .find((cat) => cat.parent._id === selectedParentCategory)
                  ?.children.map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-violet-900"
            required
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-900"
              min="0"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-900"
              required
            />
          </div>
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variants
          </label>
          {variants.map((variant, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                name="variantName"
                value={variant.variantName}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Variant Name"
                className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-violet-900"
                required
              />
              <input
                type="text"
                name="variantValue"
                value={variant.variantValue}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Variant Value"
                className="border border-gray-300 p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-violet-900"
                required
              />
            </div>
          ))}
        </div> */}

        <button
          type="submit"
          className="bg-violet-900 text-white px-4 py-2 rounded hover:bg-violet-800"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProducts;
