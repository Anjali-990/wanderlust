const express = require("express");
const router = express.Router({ mergeParams: true }); // IMPORTANT!
const wrapAsync = require("../utils/wrapAsync.js");

//middlewares
const {
  isloggedIn,
  isReviewAuthor,
  validateReview,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

//post review route
router.post(
  "/",
  isloggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);
//delete review route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
