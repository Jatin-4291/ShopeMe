import User from "../Models/userModels.js";
import catchAsync from "../utils/catchAsync.js";
import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from "./handlerFactory.js";
import Product from "../Models/productModels.js";
import Order from "../Models/ordersModels.js";
export const getAllUsers = getAll(User);
export const getOneUser = getOne(User);
export const deleteOneUser = deleteOne(User);
export const updateUser = updateOne(User);
export const createUser = catchAsync(async (req, res, next) => {
  if (req.body.roles === "admin")
    return next(
      new AppError("You do not have permission to signup as a moderator", 401)
    );

  if (!req.body.password) {
    req.body.password = req.body.passwordConfirm =
      req.body.mobileNumber.toString();
  }

  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
export const getProductCatalogue = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const products = await Product.find({
    seller: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: {
      products,
    },
  });
});

export const getSellerOrders = catchAsync(async (req, res, next) => {
  // Extract seller ID from the request (e.g., from req.user)
  const sellerId = req.user.id;
  // Query orders for the seller and populate the products field
  const orders = await Order.find({ seller: sellerId }).populate({
    path: "productID",
    select: "seller",
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
