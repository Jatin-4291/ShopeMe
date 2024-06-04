import { ApiFeatures } from "../utils/apiFeatures.js";
import AppError from "../utils/AppError.js";
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
      runvalidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with the ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
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
    const features = new ApiFeatures(Model.find({}), req.query)
      .filter()
      .sort()
      .fields()
      .pagination()
      .search();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        doc,
      },
    });
  });
