import express from "express";
import { protect, restrictTo } from "../controllers/authControllers";
import {
  cancelDelivery,
  createDelivery,
  getDeliveryForSeller,
  getDeliveryForUser,
} from "../controllers/deliveryControllers";
const Router = express.Router();

Router.post("/", protect, restrictTo("seller"), createDelivery);
Router.get("/:sellerId", protect, restrictTo("seller"), getDeliveryForSeller);
Router.get("/", protect, restrictTo("seller"), getDeliveryForUser);
Router.delete("/", protect, cancelDelivery);
export default Router;
