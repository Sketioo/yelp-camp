const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const wrapAsync = require("../utils/asyncWrapper");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  isLoggedIn,
  checkCampOwner,
  validateCampground,
} = require("../middleware");

router
  .route("/")
  .get(campgrounds.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    checkCampOwner,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, checkCampOwner, wrapAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  checkCampOwner,
  wrapAsync(campgrounds.renderEditForm)
);

module.exports = router;
