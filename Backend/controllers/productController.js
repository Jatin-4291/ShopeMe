// controllers/productController.js
import Product from "../Models/productModels.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from "./handlerFactory.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    category,
    description,
    price,
    brand,
    variantType,
    variantValue,
  } = req.body;
  const seller = req.user.id;

  const imageUrls = req.files.map((file) => ({
    url: file.path,
    alt: file.originalname,
  }));

  const product = await Product.create({
    name,
    category,
    description,
    price,
    brand,
    variantType,
    variantValue,
    seller,
    images: imageUrls,
  });

  res.status(201).json({
    status: "success",
    data: {
      data: product,
    },
  });
});

export const getAllProduct = getAll(Product);
export const getProductByID = catchAsync(async (req, res, next) => {
  const doc = await Product.findById(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with the ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

export const getProductByName = catchAsync(async (req, res, next) => {
  const productsName = req.params.name;
  const products = await Product.find({
    name: new RegExp(`^${productsName}$`, "i"),
  });
  if (!products) {
    return next(new AppError("No product found with this name", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

export const updateProduct = updateOne(Product);
export const deleteProduct = deleteOne(Product);
