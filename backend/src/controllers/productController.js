const productService = require("../services/productService");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      const notFoundError = new Error("Product not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
