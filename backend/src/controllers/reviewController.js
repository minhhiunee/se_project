const reviewService = require("../services/reviewService");

exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const payload = await reviewService.listReviewsForProduct(
      req.params.productId
    );
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
