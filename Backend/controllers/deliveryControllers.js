import Delivery from "../Models/deliveryModels";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import Order from "../Models/ordersModels.js";
import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from "./handlerFactory.js";

export const createDelivery = catchAsync(async (req, res, next) => {
  const orderID = req.params.id;
  const doc = Delivery.create({ ...req.body, orderID: orderID });
  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
export const getDeliveryForSeller = catchAsync(async (req, res, next) => {
  const sellerId = req.params.sellerId;

  // Find all orders placed by the seller
  const orders = await Order.find({ userID: sellerId });

  // Extract order IDs from the orders
  const orderIds = orders.map((order) => order._id);

  // Find all deliveries associated with these orders
  const deliveries = await Delivery.find({ orderID: { $in: orderIds } });

  res.status(200).json({
    status: "success",
    data: {
      deliveries,
    },
  });
});

export const getDeliveryForUser = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const orders = await Order.find({ userID: userID });
  const orderIds = orders.map((order) => order._id);
  const deliveries = await Delivery.find({ orderID: { $in: orderIds } });

  res.status(200).json({
    status: "success",
    data: {
      deliveries,
    },
  });
});
export const cancelDelivery = deleteOne(Delivery);
