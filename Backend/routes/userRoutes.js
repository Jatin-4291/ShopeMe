import express from "express";
import {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authControllers.js";
import {
  deleteOneUser,
  getOneUser,
  updateUser,
} from "../controllers/userController.js";
const Router = express.Router();
Router.post("/signup", signUp);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);
Router.patch("/resetPassword/:token", resetPassword);
Router.patch("/updatePassword", protect, updatePassword);
Router.get("/:id", protect, getOneUser);
Router.patch("/:id", protect, updateUser);
Router.delete("/", protect, deleteOneUser);

export default Router;
