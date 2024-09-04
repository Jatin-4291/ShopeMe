import Order from "../Models/ordersModels.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../Models/userModels.js";
import Product from "../Models/productModels.js";
import { deleteOne, updateOne } from "./handlerFactory.js";
import AppError from "../utils/AppError.js";
import Review from "../Models/reviewModels.js";
import mongoose from "mongoose";
import { getAll } from "./handlerFactory.js";
export const createOrder = catchAsync(async (req, res, next) => {
  const { userId, products, totalAmount } = req.body;

  if (
    !userId ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return next(new AppError("Invalid input", 400));
  }

  // Group products by seller ID
  const productGroups = products.reduce((groups, product) => {
    const { sellerId } = product;

    if (!groups[sellerId]) {
      groups[sellerId] = [];
    }
    groups[sellerId].push(product);
    return groups;
  }, {});

  // Create an order for each seller
  const orders = [];
  for (const sellerId in productGroups) {
    const productsForSeller = productGroups[sellerId];

    // Create the order object
    const order = {
      userId,
      sellerId,
      products: productsForSeller,
      totalAmount: totalAmount,
      createdAt: new Date(),
    };

    // Save the order to the database
    const savedOrder = await Order.create(order);
    orders.push(savedOrder);

    // Update the stock for each product
    for (const product of productsForSeller) {
      const productInDb = await Product.findById(product.productId); // Assuming `Product` is your product model
      if (!productInDb) {
        return next(new AppError("Product not found", 404));
      }

      // Reduce the stock
      productInDb.stock -= product.quantity;

      if (productInDb.stock < 0) {
        return next(new AppError("Insufficient stock", 400));
      }

      await productInDb.save();
    }
  }

  res.status(201).json({
    status: "success",
    data: {
      orders,
    },
  });
});

export const getOrders = catchAsync(async (req, res, next) => {
  const userId = req.params.userId; // Extract the userId from the route parameters
  console.log(userId);

  // Fetch all orders for the user
  const orders = await Order.find({ userId }).populate({
    path: "products.productId", // Populate the productId field within the products array
  });

  if (orders.length === 0) {
    return next(new AppError("No orders found for this user", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
export const getAllOrders = catchAsync(async (re, res, next) => {
  const orders = await Order.find()
    .populate({
      path: "products.productId",
    })
    .populate({
      path: "userId", // Ensure that the path matches the field name in your Order schema
      select: "firstName lastName email mobileNumber address", // Adjust fields as needed
    });
  res.status(200).json({
    status: "success",
    data: {
      orders, // Changed to directly reference the orders variable
    },
  });
});
export const getOrdersForSeller = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ sellerId: req.user.id })
    .populate({
      path: "products.productId",
    })
    .populate({
      path: "userId", // Ensure that the path matches the field name in your Order schema
      select: "firstName lastName email mobileNumber address", // Adjust fields as needed
    });

  res.status(200).json({
    status: "success",
    data: {
      orders, // Changed to directly reference the orders variable
    },
  });
});

export const getSellerOverview = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log(sellerId);

    // const { startDate, endDate } = req.query; // Optional date range for filtering

    // 1. Total Revenue
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: { $in: ["Placed", "Dispatched", "Delivered"] },
        },
      },
      {
        $match: {
          placedDate: {
            $gte: new Date("1970-01-01"),
            $lte: new Date(),
          },
        },
      },

      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    console.log("hello", totalRevenue);
    // 2. Number of Orders
    const orderCounts = await Order.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Top-Selling Products
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: { $in: ["Placed", "Dispatched", "Delivered"] },
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }, // Fetch top 5 products
      {
        $project: {
          productId: "$_id",
          name: "$product.name",
          totalSold: 1,
        },
      },
    ]);

    // 4. Recent Orders
    const recentOrders = await Order.find({ sellerId })
      .sort({ placedDate: -1 })
      .limit(10)
      .populate("userId", "name")
      .populate("products.productId", "name");

    // 5. Pending Orders
    const pendingOrders = await Order.find({
      sellerId,
      status: { $in: ["Placed", "Dispatched"] },
    }).sort({ placedDate: -1 });

    // // 6. Customer Reviews
    // const customerReviews = await Review.find({ sellerId })
    //   .sort({ createdAt: -1 })
    //   .limit(5)
    //   .populate("productId", "name")
    //   .populate("userId", "name");

    res.status(200).json({
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      orderCounts,
      topSellingProducts,
      recentOrders,
      pendingOrders,
      // customerReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrders = updateOne(Order);
export const cancelOrder = deleteOne(Order);
