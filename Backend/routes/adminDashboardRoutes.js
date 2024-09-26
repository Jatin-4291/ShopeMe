import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import {
  getDashboardStats,
  getSellerMonthlyReport,
  createBoard,
} from "../controllers/adminDashboard.js";
import uploadConfig from "../config/multerConfig.js";
Router.get("/", protect, restrictTo("admin"), getDashboardStats);
Router.get("/payseller", protect, restrictTo("admin"), getSellerMonthlyReport);
Router.post(
  "/boards",
  protect,
  restrictTo("admin"),
  uploadConfig.uploadBoardImages.single("image"),
  createBoard
);

export default Router;
