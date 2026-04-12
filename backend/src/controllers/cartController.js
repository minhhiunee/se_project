const cartService = require("../services/cartService");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartForUser(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.user.id, req.body);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
