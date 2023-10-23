const Campground = require('./models/campground');
const {campgroundSchema, reviewSchema} = require('./schemas')
const wrapAsync = require('./utils/asyncWrapper');
const ErrorApp = require('./utils/ErrorApp');

module.exports.validateCampground = wrapAsync(async (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ErrorApp(400, message);
  }
  next();
});

module.exports.validateReview = wrapAsync(async (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ErrorApp(400, message);
  }
  next();
});

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.checkCampOwner = async (req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}
