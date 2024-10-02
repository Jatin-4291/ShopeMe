import Category from "../Models/categoryModels.js";
import {
  createOne,
  deleteOne,
  updateOne,
  getAll,
  getOne,
} from "./handlerFactory.js";
import catchAsync from "../utils/catchAsync.js";

export const createCategory = catchAsync(async (req, res, next) => {
  const { name, parentCategory } = req.body;
  console.log(name, parentCategory);

  console.log(req.body);

  // Check if an image file was uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "No image file provided",
    });
  }

  // Create a new category object with the uploaded image URL, name, and description
  const categoryData = {
    image: req.file.path, // Store Cloudinary URL or path
    name,
  };

  // If parentCategory is provided, add it to the category data
  if (parentCategory) {
    categoryData.parentCategory = parentCategory;
  }

  // Create the new category in the database
  const newCategory = await Category.create(categoryData);

  res.status(201).json({
    status: "success",
    data: {
      categories: newCategory,
    },
  });
});

export const updateCategory = updateOne(Category);

export const deleteCategory = deleteOne(Category);

export const getCategoryByName = catchAsync(async (req, res, next) => {
  const name = req.params.name; // Changed to req.params.name
  const doc = await Category.findOne({ name });

  if (!doc) {
    return next(new AppError("No document found with that name", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
export const getCategoriesWithSubcategories = catchAsync(
  async (req, res, next) => {
    // Query to find categories with at least one subcategory
    const categories = await Category.find({
      subcategories: { $exists: true, $ne: [] },
    });

    if (!categories.length) {
      return next(new AppError("No categories found with subcategories", 404));
    }

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  }
);
export const getParentCategories = async (req, res) => {
  console.log("hello");

  try {
    const parents = await Category.find({ parentCategory: null }).exec();

    if (!parents || parents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No parent categories found",
      });
    }
    res.status(200).json({
      success: true,
      data: parents,
    });
  } catch (error) {
    console.error("Error fetching parent categories: ", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parent categories",
      error: error.message,
    });
  }
};

// Get all child categories (categories with a parent)
export const getChildCategoriesByParent = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Fetch child categories of the specified parent category
    const children = await Category.find({ parentCategory: parentId });

    if (children.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No child categories found for this parent",
      });
    }

    res.status(200).json({
      success: true,
      data: children,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching child categories",
      error: error.message,
    });
  }
};
// Get a category by ID
export const getCategoryById = getOne(Category);

// Get all categories
export const getAllCategories = getAll(Category);
