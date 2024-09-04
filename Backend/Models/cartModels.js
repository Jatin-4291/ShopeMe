import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: false,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Assuming you have a Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a Seller model
        required: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
