const cartService = require("../services/cartService");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const updatedCart = await cartService.addToCart(req.body);
    res.status(201).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const updatedCart = await cartService.removeFromCart(req.params.productId);
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};
