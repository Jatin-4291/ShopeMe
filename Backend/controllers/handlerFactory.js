import ApiFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    const doc = await Model.findById(req.params.id);
    console.log(doc);
    if (!doc) {
      return next(new AppError("No document found with the ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(req.body, doc);

    if (!doc) {
      return next(new AppError("No document found with the ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
    console.log(doc);
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No doc found with the ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1; // Convert string to number, default to page 1
    const limit = req.query.limit * 1 || 10; // Default limit of 10 documents per page
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Create query with pagination, filtering, sorting, etc.
    const features = new ApiFeatures(Model.find({}), req.query)
      .filter()
      .sort()
      .fields()
      .pagination()
      .search();

    const totalDocuments = await Model.countDocuments(); // Get total number of documents
    const doc = await features.query.skip(skip).limit(limit); // Apply limit for pagination

    // Return the result
    res.status(200).json({
      status: "success",
      result: doc.length,
      page, // Return the current page
      totalPages: Math.ceil(totalDocuments / limit), // Return the total number of pages
      data: {
        doc, // Return the paginated results
      },
    });
  });
