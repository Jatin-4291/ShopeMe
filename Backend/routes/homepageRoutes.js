import express from "express";
const Router = express.Router();
import { protect, restrictTo } from "../controllers/authControllers.js";
import { getAllBoards, createBoard } from "../controllers/adminDashboard.js";
import uploadConfig from "../config/multerConfig.js";
Router.get("/boards", getAllBoards);

export default Router;
