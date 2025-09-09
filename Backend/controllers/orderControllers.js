import Order from "../Models/ordersModels.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../Models/userModels.js";
import Product from "../Models/productModels.js";
import { deleteOne, updateOne } from "./handlerFactory.js";
import AppError from "../utils/appError.js";
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

    // 1. Total Revenue (Date-wise) and Overall Total Revenue
    const revenueData = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: { $in: ["Placed", "Dispatched", "Delivered"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$placedDate" } },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    const overallTotalRevenue = revenueData.reduce(
      (acc, curr) => acc + curr.totalRevenue,
      0
    );

    // 2. Number of Orders by Date
    const orderCountsByDate = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          status: { $in: ["Placed", "Dispatched", "Delivered"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$placedDate" } },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    // 3. Number of Orders overall
    const orderCounts = await Order.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // 4. Top-Selling Products
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
          images: "$product.images",
        },
      },
    ]);

    // 5. Recent Orders
    const recentOrders = await Order.find({ sellerId })
      .sort({ placedDate: -1 })
      .limit(5)
      .populate("userId", "firstName lastName email mobileNumber address")
      .populate({
        path: "products.productId",
        select: "name images",
      });

    // 6. Pending Orders
    const pendingOrders = await Order.find({
      sellerId,
      status: { $in: ["Placed", "Dispatched"] },
    }).sort({ placedDate: -1 });

    // 7. All Reviews for the Seller
    const allReviews = await Review.aggregate([
      {
        $lookup: {
          from: "products", // Join with the products collection
          localField: "product", // Field in Review that contains product reference
          foreignField: "_id", // Field in Product that matches
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Unwind to get product details for each review
      },
      {
        $match: {
          "productDetails.seller": new mongoose.Types.ObjectId(sellerId), // Filter reviews for products sold by the seller
        },
      },
      {
        $project: {
          rating: 1,
          review: 1,
          productId: "$product",
          productName: "$productDetails.name",
          productImage: { $arrayElemAt: ["$productDetails.images", 0] }, // Assuming images is an array
        },
      },
    ]);
    res.status(200).json({
      revenueByDate: revenueData,
      orderCountsByDate,
      overallTotalRevenue,
      orderCounts,
      topSellingProducts,
      recentOrders,
      pendingOrders,
      allReviews, // Send all reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderStats = catchAsync(async (req, res, next) => {
  const { sellerId } = req.params;
  const { sortType } = req.query; // Get the sorting type from the query (e.g., "year", "month", "day")

  // Define date format based on sortType
  let dateFormat;
  if (sortType === "year") {
    dateFormat = "%Y";
  } else if (sortType === "month") {
    dateFormat = "%Y-%m";
  } else {
    dateFormat = "%Y-%m-%d";
  }

  // 1. Total Revenue and Order Count based on date
  const revenueAndOrderCount = await Order.aggregate([
    {
      $match: {
        sellerId: new mongoose.Types.ObjectId(sellerId),
        status: { $in: ["Placed", "Dispatched", "Delivered"] },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$placedDate" } },
        totalRevenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date in ascending order
    },
  ]);

  // Calculate overall total revenue and order count separately (Optional)
  const overallStats = revenueAndOrderCount.reduce(
    (acc, curr) => {
      acc.totalRevenue += curr.totalRevenue;
      acc.orderCount += curr.orderCount;
      return acc;
    },
    { totalRevenue: 0, orderCount: 0 }
  );

  res.status(200).json({
    status: "success",
    data: {
      revenueAndOrderCount,
      overallStats,
    },
  });
});

export const updateOrders = updateOne(Order);
export const cancelOrder = deleteOne(Order);
