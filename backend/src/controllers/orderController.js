const orderService = require("../services/orderService");

exports.checkout = async (req, res, next) => {
  try {
    const result = await orderService.checkoutFromCart(req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersForUser(req.user.id);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
