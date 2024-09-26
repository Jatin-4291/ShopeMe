import mongoose from "mongoose";

// Assuming you already have a Product model
const boardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // This references the Product model
    required: true,
  },
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
