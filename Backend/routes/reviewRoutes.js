import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
  getReviewsByProductId,
  createReviewForProduct,
  getReviewsByUserId,
} from "../controllers/reviewControllers.js";
import { protect } from "../controllers/authControllers.js";
const Router = express.Router();

Router.post("/", protect, createReview);
Router.patch("/:id", protect, updateReview);
Router.get("/", protect, getAllReviews);
Router.delete("/:id", protect, deleteReview);
Router.get("/:productId", protect, getReviewsByProductId);
Router.get("/user/:id", protect, getReviewsByUserId);
Router.post("/:productId", protect, createReviewForProduct);

export default Router;
