const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/asyncWrapper");
const { isLoggedIn, validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, reviews.deleteReview);

module.exports = router;
