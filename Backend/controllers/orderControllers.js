import Order from "../Models/ordersModels.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../Models/userModels.js";
import Product from "../Models/productModels.js";
export const createOrder = catchAsync(async (req, res, next) => {
  req.body.userID = req.user.id;
  const userID = req.body.userID;
  const productID = req.body.productID;
  const order = await Order.create({
    ...req.body,
    userID,
    productID: [productID],
  });
  res.status(201).json({
    status: "success",
    data: {
      data: order,
      userID,
      productID: [productID],
    },
  });
});
export const getOrders = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "productID",
  });
  const user = await User.findById(order.userID);
  res.status(201).json({
    status: "success",
    data: {
      data: order,
      user,
    },
  });
});
export const getOrdersForSeller = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate({
    path: "productID",
    select: "seller -_id",
  });
  const filteredOrders = orders.filter((order) => {
    return order.productID.some(
      (productID) => productID.seller.toString() === req.user.id
    );
  });
  res.status(201).json({
    status: "success",
    data: {
      data: filteredOrders,
    },
  });
});
