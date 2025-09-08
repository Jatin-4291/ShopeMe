import Review from "../Models/reviewModels.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.body);

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getReviewsByProductId = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId }).populate("user");
  if (!reviews.length) {
    return next(new AppError("No reviews found for this product", 404)); // Use length check instead of truthy check
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
// Example modification in your getReviewsByUserId controller function
export const getReviewsByUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const reviews = await Review.find({ user: id }).populate({
    path: "product",
  });

  if (!reviews.length) {
    return next(new AppError("No reviews found for this user", 404));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReviewForProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { review, rating } = req.body;

  if (!review || !rating) {
    return next(new AppError("Review and rating are required", 400)); // Assuming you have an AppError class to handle errors
  }
  if (!req.body.user) req.body.user = req.user.id;

  req.body.product = productId; // Set the product ID
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
