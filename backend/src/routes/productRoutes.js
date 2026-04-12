const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/sort/price", productController.getProductsSortedByPrice);
router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.get("/:id", productController.getProductById);

module.exports = router;
