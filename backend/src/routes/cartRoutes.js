const express = require("express");
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.delete("/remove/:id", cartController.removeFromCart);

module.exports = router;
