import mongoose from "mongoose";
import Category from "./categoryModels.js";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "A product must have a category"],
    },
    images: [
      {
        url: {
          type: String,
          required: [true, "An image must have a URL"],
        },
        alt: String,
      },
    ],
    description: {
      type: String,
      required: [true, "A product must have a description"],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
      min: [0, "Price must be above 0"],
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Assuming you have a User model
      required: [true, "A product must have a seller"],
    },
    brand: {
      type: String,
      required: [true, "A product must have a brand"],
    },
    variantType: {
      type: String,
    },
    variantValue: {
      type: String,
    },
    stock: {
      type: Number,
      required: [true, "The stock No. must be provided"],
      default: 300,
    },
    status: {
      type: String,
      required: [true, "The stock of the user must be defined"],
      default: "In stock",
      enum: ["In stock", "Out of Stock", "Low stock"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
