import Category from "../Models/categoryModels.js";
import {
  createOne,
  deleteOne,
  updateOne,
  getAll,
  getOne,
} from "./handlerFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createCategory = createOne(Category);

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
// Get a category by ID
export const getCategoryById = getOne(Category);

// Get all categories
export const getAllCategories = getAll(Category);
