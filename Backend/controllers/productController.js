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

export const createProduct = catchAsync(async (req, res, next) => {
  req.body.seller = req.user.id;
  const doc = await Product.create({ ...req.body, seller: req.body.seller });
  const seller = req.body.seller;
  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
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
  console.log(productsName);
  const products = await Product.find({
    name: new RegExp(`^${productsName}$`, "i"),
  });
  if (!products) {
    return next(new AppError("No product found with this name", 404));
  }
  console.log(products);
  res.status(200).json({
    status: "success",
    data: {
      products: products,
    },
  });
});

export const updateProduct = updateOne(Product);
