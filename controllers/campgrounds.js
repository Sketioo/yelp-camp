const Campground = require("../models/campground");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
// const ErrorApp = require("../utils/ErrorApp");
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = async (req, res, next) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const newCamp = new Campground(req.body.campground);
  console.log(req.body.campground.location)
  newCamp.geometry = geoData.body.features[0].geometry;
  newCamp.images = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });
  newCamp.author = req.user._id;
  await newCamp.save();
  console.log(newCamp);
  req.flash("success", "Successfully creating a campground!");
  res.redirect(`campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find a campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camp });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find a campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
  if (!camp) {
    req.flash("error", "Cannot find a campground!");
    return res.redirect("/campgrounds");
  }

  if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  const imgs = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });

  camp.images.push(...imgs);
  await camp.save();

  req.flash("success", "Successfully updating a campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleting a campground!");
  if (!camp) {
    req.flash("error", "Cannot find a campground!");
    return res.redirect("/campgrounds");
  }

  res.redirect("/campgrounds");
};
