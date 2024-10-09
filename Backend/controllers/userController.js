import User from "../Models/userModels.js";
import catchAsync from "../utils/catchAsync.js";
import cloudinary from "../config/cloudinaryConfig.js";
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
export const getProductCatalogue = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const products = await Product.find({
    seller: req.user.id,
  }).populate({
    path: "category",
    select: ["_id", "name"],
  });
  res.status(201).json({
    status: "success",
    data: {
      products,
    },
  });
});

export const addSellerSignature = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Signature file is required",
    });
  }

  try {
    // Upload file to Cloudinary
    const signature = req.file.path;

    // Update the user with the signature URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { sellerSignature: signature },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Seller signature updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
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
