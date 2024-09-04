import mongoose from "mongoose";
import User from "./userModel"; // Assuming you have a User model for delivery personnel
import Order from "./orderModel"; // Assuming you have an Order model

const deliverySchema = mongoose.Schema({
  orderID: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: [true, "A delivery must be associated with an order"],
  },
  trackingId: {
    type: String,
    required: [true, "A delivery must have a tracking ID"],
    unique: true,
  },
  estimatedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

deliverySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
