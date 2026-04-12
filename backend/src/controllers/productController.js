const productService = require("../services/productService");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.listProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductsSortedByPrice = async (req, res, next) => {
  try {
    const order = String(req.query.order || "asc").toLowerCase();
    if (order !== "asc" && order !== "desc") {
      const err = new Error('Query "order" must be "asc" or "desc"');
      err.statusCode = 400;
      throw err;
    }
    const products = await productService.listProductsByPrice(order);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
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
