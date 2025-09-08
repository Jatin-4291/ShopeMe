import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import {
  getSellerOverview,
  getOrderStats,
} from "../controllers/orderControllers.js";

Router.get("/:sellerId", protect, restrictTo("seller"), getSellerOverview);
Router.get(
  "/analytics/:sellerId",
  protect,
  restrictTo("seller"),
  getOrderStats
);

export default Router;
