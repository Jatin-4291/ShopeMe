import express from "express";
const Router = express.Router();
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductByID,
  getProductByName,
  updateProduct,
} from "../controllers/productController.js";
import { getProductCatalogue } from "../controllers/userController.js";
import { protect, restrictTo } from "../controllers/authControllers.js";
import upload from "../config/multerConfig.js";
Router.post(
  "/",
  protect,
  restrictTo("seller"),
  upload.array("images", 10),
  createProduct
);
Router.get("/:id", protect, getProductByID);
Router.get("/search/:name", protect, getProductByName);
Router.get("/", protect, restrictTo("seller"), getProductCatalogue);
Router.patch(
  "/:id",
  protect,
  restrictTo("seller", "admin"),
  upload.array("images", 10),
  updateProduct
);
Router.delete("/:id", protect, restrictTo("admin", "seller"), deleteProduct);

export default Router;
