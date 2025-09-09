import express from "express";
import {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} from "../controllers/authControllers.js";
import {
  addSellerSignature,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "../controllers/userController.js";
import uploadConfig from "../config/multerConfig.js";

const Router = express.Router();
Router.post("/signup", signUp);
Router.post("/login", login);
Router.post("/forgotPassword", forgotPassword);
Router.patch("/resetPassword/:token", resetPassword);
Router.patch("/updatePassword", protect, updatePassword);
Router.get("/", protect, restrictTo("admin"), getAllUsers);
Router.get("/:id", protect, getOneUser);
Router.patch("/:id", protect, updateUser);
Router.patch(
  "/signature/:id",
  protect,
  uploadConfig.uploadSignature.single("signature"),
  addSellerSignature
);
Router.delete("/:id", protect, deleteOneUser);

export default Router;
