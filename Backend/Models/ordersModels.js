import mongoose from "mongoose";

// Define the schema for Order
const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Make sure the user ID is required
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: [true, "A order must belong to a seller"],
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
    },
  ],
  status: {
    type: String,
    required: [true, "The status of the order must be defined"],
    default: "Placed",
    enum: ["Placed", "Dispatched", "Delivered", "Cancelled"],
  },
  placedDate: {
    type: Date,
    default: Date.now, // Default to current date and time
  },
  dispatchedDate: {
    type: Date,
  },
  deliveredDate: {
    type: Date,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, "Total amount must be a positive number"],
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
});

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

export default Order;
