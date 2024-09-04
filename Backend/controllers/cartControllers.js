import Cart from "../Models/cartModels.js";
import { createOne, deleteOne, updateOne, getOne } from "./handlerFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Product from "../Models/productModels.js";

export const updateCart = updateOne(Cart);
export const getCartById = getOne(Cart);
export const deleteCart = deleteOne(Cart);
export const getCartByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId });

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});
export const addToCart = catchAsync(async (req, res, next) => {
  const { userId, productId } = req.body;

  // Find the product to get seller information
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Find the cart for the given userId

  let cart = await Cart.findOne({ userId: userId });

  if (!cart) {
    // Create a new cart with the item including seller information
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity: 1, sellerId: product.seller }],
    });
    console.log(cart);
  } else {
    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      cart.items[itemIndex].quantity += 1;
    } else {
      // Product does not exist in the cart, add a new item with seller information
      console.log(product.seller);

      cart.items.push({
        productId,
        quantity: 1,
        sellerId: product.seller,
      });
    }

    // Save the updated cart
    await cart.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});
