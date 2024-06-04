import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import {
  createOrder,
  getOrders,
  getOrdersForSeller,
} from "../controllers/orderControllers.js";
Router.post("/", protect, createOrder);
Router.get("/:id", protect, getOrders);
Router.get("/", protect, restrictTo("seller"), getOrdersForSeller);
export default Router;
