import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
  getCategoryById,
  getAllCategories,
  getCategoriesWithSubcategories,
} from "../controllers/categoryControllers.js";
import { protect, restrictTo } from "../controllers/authControllers.js";

const Router = express.Router();

Router.post("/", protect, restrictTo("admin"), createCategory);
Router.patch("/:id", protect, restrictTo("admin"), updateCategory);
Router.delete("/:id", protect, restrictTo("admin"), deleteCategory);
Router.get("/name/:name", protect, getCategoryByName);
Router.get("/:id", protect, getCategoryById);
Router.get("/", protect, getAllCategories);
export default Router;
