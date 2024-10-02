import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
  getCategoryById,
  getAllCategories,
  getParentCategories,
  getChildCategoriesByParent,
} from "../controllers/categoryControllers.js";
import { protect, restrictTo } from "../controllers/authControllers.js";
import uploadConfig from "../config/multerConfig.js";

const Router = express.Router();

// Route to create a new category (only for admins)
Router.post(
  "/",
  protect,
  restrictTo("admin"),
  uploadConfig.uploadCategoryImages.single("image"),
  createCategory
);

Router.patch("/:id", protect, restrictTo("admin"), updateCategory);
Router.delete("/:id", protect, restrictTo("admin"), deleteCategory);
Router.get("/name/:name", protect, getCategoryByName);
Router.get("/", protect, getAllCategories);
Router.get("/parents", getParentCategories);
Router.get("/:parentId", getChildCategoriesByParent);
// Router.get("/:id", protect, getCategoryById);

export default Router;
