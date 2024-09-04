import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import { getDashboardStats } from "../controllers/adminDashboard.js";
Router.get("/", protect, restrictTo("admin"), getDashboardStats);

export default Router;
