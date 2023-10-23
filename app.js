if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const port = 3000;

const userRoutes = require('./routes/user')
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const ErrorApp = require("./utils/ErrorApp");
const User = require("./models/user");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";

//* ENGINE TEMPLATING RELATED
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

//* MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret
  }
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// PASSPORT CONFIGURATIONS
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());

// passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//* General middleware focusing on template works
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  if(!['/login', '/'].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});




//* ROUTES

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);

// * MONGODB CONNECTION

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database is connected!");
}

main().catch((err) => console.log(err));

//* DEFAULT ROUTE and HANDLER
app.all("*", (req, res, next) => {
  next(new ErrorApp(404, "Page not found!"));
});

//* General Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    console.log(err.message);
    err.message = "Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
