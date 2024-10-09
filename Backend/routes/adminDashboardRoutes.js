import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import {
  getDashboardStats,
  getSellerMonthlyReport,
  createBoard,
  deleteBoard,
  getAllunverifiedSellers,
} from "../controllers/adminDashboard.js";
import uploadConfig from "../config/multerConfig.js";
Router.get("/", protect, restrictTo("admin"), getDashboardStats);
Router.get("/payseller", protect, restrictTo("admin"), getSellerMonthlyReport);
Router.get(
  "/unverified",
  protect,
  restrictTo("admin"),
  getAllunverifiedSellers
);
Router.post(
  "/boards",
  protect,
  restrictTo("admin"),
  uploadConfig.uploadBoardImages.single("image"),
  createBoard
);
Router.delete("/boards/:id", protect, restrictTo("admin"), deleteBoard);

export default Router;
