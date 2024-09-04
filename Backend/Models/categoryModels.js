import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A category must have a name"],
    unique: true,
    trim: true,
    maxlength: [50, "A category name must have less or equal to 50 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [
      500,
      "A category description must have less or equal to 500 characters",
    ],
  },
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
