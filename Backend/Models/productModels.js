import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: [true, "A product must have a name"] },
  images: {
    type: Array,
    required: [true, "A product must have images"],
  },
  description: {
    type: String,
    required: [true, "A product must have description"],
  },
  price: {
    type: Number,
    required: [true, "A product must have price"],
  },
  seller: {
    type: String,
  },
  brand: {
    type: String,
    required: [true, "A product must have a brand"],
  },
  color: {
    type: String,
  },
  variants: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
