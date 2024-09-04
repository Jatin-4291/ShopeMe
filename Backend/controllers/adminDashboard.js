import mongoose from "mongoose";
import Order from "../Models/ordersModels.js";
import User from "../Models/userModels.js";
import Product from "../Models/productModels.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Aggregation pipeline for Orders collection
    const orderStats = await Order.aggregate([
      { $match: { status: "Placed" } }, // Match only orders with status "Placed"
      { $unwind: "$products" }, // Unwind the products array
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$products.quantity" }, // Sum of all quantities in all orders
          totalIncome: { $sum: "$totalAmount" }, // Sum of all total amounts
          totalOrders: { $sum: 1 }, // Count of orders
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalIncome: 1,
          totalOrders: 1,
        },
      },
    ]);

    // Aggregation pipeline for Users collection
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 }, // Count of users
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
        },
      },
    ]);

    // Aggregation for Orders by Category
    const ordersByCategory = await Order.aggregate([
      { $unwind: "$products" }, // Unwind the products array
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalOrders: { $sum: 1 }, // Count of orders by category
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          categoryName: "$categoryDetails.name",
          totalOrders: 1,
        },
      },
    ]);

    // Aggregation for Top Products
    const topProducts = await Order.aggregate([
      { $unwind: "$products" }, // Unwind the products array
      {
        $group: {
          _id: "$products.productId",
          totalSales: { $sum: "$products.quantity" }, // Sum of all quantities for each product
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          productName: "$productDetails.name",
          totalSales: 1,
          productImage: "$productDetails.images",
          productPrice: "$productDetails.price",
        },
      },
      { $sort: { totalSales: -1 } }, // Sort by total sales in descending order
      { $limit: 5 }, // Limit to top 5 products
    ]);

    // Aggregation for Total Orders by State
    const ordersByState = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: "$userDetails.address.state",
          totalOrders: { $sum: 1 }, // Count of orders by state
          totalIncome: { $sum: "$totalAmount" }, // Sum of total amounts by state
        },
      },
      {
        $project: {
          state: "$_id",
          totalOrders: 1,
          totalIncome: 1, // Project the totalIncome field
        },
      },
      { $sort: { totalOrders: -1 } }, // Sort by total orders in descending order
    ]);

    // Aggregation for Top Sellers
    const topSellers = await Order.aggregate([
      {
        $group: {
          _id: "$sellerId",
          totalIncome: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "seller",
          as: "sellerProducts",
        },
      },
      { $unwind: "$sellerDetails" },
      {
        $project: {
          sellerName: {
            $concat: [
              "$sellerDetails.firstName",
              " ",
              "$sellerDetails.lastName",
            ],
          },
          sellerProducts: "$sellerProducts.name", // Correctly projecting the seller's product names
          totalIncome: 1,
        },
      },
      { $sort: { totalIncome: -1 } },
      { $limit: 5 },
    ]);

    // Construct the response object
    const stats = {
      totalSales: orderStats[0]?.totalSales || 0,
      totalIncome: orderStats[0]?.totalIncome || 0,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalUsers: userStats[0]?.totalUsers || 0,
      ordersByCategory,
      topProducts,
      ordersByState,
      topSellers,
    };

    // Send the response
    res.json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
