import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import { getSellerOverview } from "../controllers/orderControllers.js";

Router.get("/:sellerId", protect, restrictTo("seller"), getSellerOverview);

export default Router;
