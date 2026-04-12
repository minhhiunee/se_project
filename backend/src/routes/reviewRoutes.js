const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, reviewController.createReview);
router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;
