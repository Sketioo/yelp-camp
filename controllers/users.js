const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegister = (req, res) => {
  res.render("auth/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome!!`);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
}

module.exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

module.exports.login = async (req, res) => {
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  const user = await User.findOne({ username: req.body.username });
  req.flash("success", `Welcome, ${user.username}`);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/campgrounds");
  });
};
