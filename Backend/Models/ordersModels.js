import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  placedBy: {
    type: String,
    required: [true, "A order must be placed by a person"],
  },
  contactNo: {
    type: Number,
    required: [true, "A order must have a contact no."],
  },
  Email: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "A order must have a delivery Adress"],
  },
  placedDate: {
    type: Date,
    default: Date.now,
  },
  reciveDate: {
    type: Date,
    default: Date.now,
  },
  pincode: {
    type: Number,
  },
  userID: {
    type: String,
  },
  productID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  roles: {
    type: String,
    required: [true, "The role of the user must be defined"],
    default: "customer",
    enum: ["customer", "seller", "admin"],
  },
  dispatched: {
    type: Boolean,
    default: false,
  },
});
const Order = mongoose.model("Order", orderSchema);

export default Order;
