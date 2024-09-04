import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from "../controllers/reviewControllers";
import { protect } from "../controllers/authControllers";
const Router = express.Router();

const router = express.Router();
router.post("/", protect, createReview);
router.patch("/:id", protect, updateReview);
router.get("/", protect, getAllReviews);
router.get("/:id", protect, getReview);
router.delete("/:id", protect, deleteReview);
