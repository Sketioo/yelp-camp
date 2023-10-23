const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const wrapAsync = require("../utils/asyncWrapper");
const { storeReturnTo } = require("../middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(wrapAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(users.login)
  );

router.get("/logout", users.logout);

module.exports = router;
