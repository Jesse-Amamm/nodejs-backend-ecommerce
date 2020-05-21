const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviews");
const middleware = require("../helpers/middleware");

//GET all reviews paginated
router.get(
  "/product-reviews-paginated",
  reviewController.getProductReviewsPaginated
);
//GET all categories
router.get("/product-reviews", reviewController.getProductReviews);

//POST create review
router.post(
  "/product-review",
  middleware.checkToken,
  reviewController.addReview
);

//GET single review
router.get(
  "/product-review/:reviewId",
  reviewController.getSingleProductReview
);

module.exports = router;
