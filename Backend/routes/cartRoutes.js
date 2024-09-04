import express from "express";
import {
  updateCart,
  getCartById,
  deleteCart,
  getCartByUser,
  addToCart,
} from "../controllers/cartControllers.js";
const Router = express.Router();

Router.post("/", addToCart);
Router.patch("/:id", updateCart);
Router.get("/:id", getCartById);
Router.delete("/:id", deleteCart);
Router.get("/user/:userId", getCartByUser);

export default Router;
