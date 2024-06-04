import express from "express";
const Router = express.Router();
import {
  createProduct,
  getProductByID,
  getProductByName,
  updateProduct,
} from "../controllers/productController.js";
import { getProductCatalogue } from "../controllers/userController.js";
import { protect, restrictTo } from "../controllers/authControllers.js";

Router.post("/", protect, restrictTo("seller"), createProduct);
Router.get("/:id", protect, getProductByID);
Router.get("/search/:name", protect, getProductByName);
Router.get("/", protect, restrictTo("seller"), getProductCatalogue);
Router.patch("/", updateProduct);

export default Router;
