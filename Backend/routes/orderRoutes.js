import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import {
  cancelOrder,
  createOrder,
  getOrders,
  getOrdersForSeller,
  updateOrders,
  getSellerOverview,
  getAllOrders,
} from "../controllers/orderControllers.js";
Router.post("/", protect, createOrder);
Router.get("/getOrder/:userId", protect, getOrders);
Router.get("/", protect, restrictTo("seller"), getOrdersForSeller);
Router.delete("/:id", protect, cancelOrder);
Router.patch("/:id", protect, updateOrders);
Router.get("/allOrders", protect, restrictTo("admin"), getAllOrders);
export default Router;
