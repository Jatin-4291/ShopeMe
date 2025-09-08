// controllers/productController.js
import Product from "../Models/productModels.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from "./handlerFactory.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    category,
    description,
    price,
    brand,
    variantType,
    variantValue,
  } = req.body;
  const seller = req.user.id;

  const imageUrls = req.files.map((file) => ({
    url: file.path,
    alt: file.originalname,
  }));

  const product = await Product.create({
    name,
    category,
    description,
    price,
    brand,
    variantType,
    variantValue,
    seller,
    images: imageUrls,
  });

  res.status(201).json({
    status: "success",
    data: {
      data: product,
    },
  });
});

export const getAllProduct = getAll(Product);
export const getProductByID = catchAsync(async (req, res, next) => {
  const doc = await Product.findById(req.params.id);
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

export const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.params;

    console.log(query);

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });
    console.log(products);

    // Filter out products where the category didn't match the query
    const filteredProducts = products.filter(
      (product) => product.category !== null
    );

    res.status(200).json({
      status: "success",
      results: filteredProducts.length,
      data: {
        products: filteredProducts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getProductsByCategoryId = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;

  // Fetch products based on category ID
  const products = await Product.find({ category: categoryId });

  if (!products || products.length === 0) {
    return next(new AppError("No products found for this category", 404));
  }

  // Return the products in response
  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});
import puppeteer from "puppeteer";

// Scrape Amazon
export const scrapeProducts = catchAsync(async (req, res, next) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { productName } = req.params;

  const searchUrlAmazon = `https://www.amazon.in/s?k=${encodeURIComponent(
    productName
  )}`;
  await page.goto(searchUrlAmazon, { waitUntil: "domcontentloaded" });
  const productDetailsAmazon = await page.evaluate(() => {
    const product = document.querySelector(".a-spacing-base");
    const image = product?.querySelector("img")?.src;
    const title = product?.querySelector("h2 a span")?.innerText || "N/A";
    const price = product?.querySelector(".a-price")?.innerText || "N/A";
    return { image, title, price };
  });
  const searchUrlFLipkart = `https://www.flipkart.com/search?q=${encodeURIComponent(
    productName
  )}`;

  await page.goto(searchUrlFLipkart, { waitUntil: "domcontentloaded" });
  const productDetailsFLipkart = await page.evaluate(() => {
    const product = document.querySelector(".slAVV4");
    if (!product) {
      return { title: "N/A", price: "N/A", imageUrl: "N/A" };
    }
    const title = product.querySelector(".wjcEIp")?.innerText || "N/A";
    const price = product.querySelector("a div .Nx9bqj")?.innerText || "N/A";
    const imageUrl = product.querySelector("img")?.src || "N/A";

    return { title, price, imageUrl };
  });
  await browser.close();
  res.status(200).json({
    status: "success",
    data: { productDetailsAmazon, productDetailsFLipkart },
  });
});

export const updateProduct = updateOne(Product);
export const deleteProduct = deleteOne(Product);
