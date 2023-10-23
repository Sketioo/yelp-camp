const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash("success", "Successfully creating a review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  //* Untuk menghapus unique_id review
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  //* Untuk menghapus data review dari collection
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleting a review!");
  res.redirect(`/campgrounds/${id}`);
};
