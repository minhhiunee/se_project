const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/checkout", authenticate, orderController.checkout);
router.get("/my", authenticate, orderController.getMyOrders);

module.exports = router;
