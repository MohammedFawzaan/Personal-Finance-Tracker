const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const localStrategy = require('passport-local');

// user model require.
const User = require('./model/userModel');

// ejs, ejs-mate require
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

app.engine("ejs", ejsMate); // set ejsMate
app.set("view engine", "ejs"); // set views engine
app.set("views", path.join(__dirname, "views")); // views

// middlewares for static files etc
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/CSS")));
app.use(express.static(path.join(__dirname, "/public/JS")));

// mongoose Connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/FinanceApp');
    console.log("db connected");
}

// specified session Options
const sessionOptions = session({
  secret: "MySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+(1000*60*60*24*3),
    maxAge: (1000*60*60*24*3),
    httpOnly: true
  }
});

// middleware cookie parser
app.use(cookieParser("secretCode"));
// session middleware
app.use(sessionOptions);
// connect-flash middleware
app.use(flash());

// Using Cookie
app.get('/get', (req, res) => {
  res.cookie('color', 'red', {signed: true});
  res.send('done');
});
app.get('/verify', (req, res) => {
  res.send(req.signedCookies);
});

// set up req.locals middleware.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // current User
  res.locals.currentUser = req.user;
  next();
});

// using passport and its middlewares.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for Routes.
app.use('/', require('./routes/myRoute'));
app.use('/', require('./routes/reportRoute'));
app.use('/', require('./routes/expensesRoute'));
app.use('/', require('./routes/userRoute'));

// if user enters wrong route enter
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'PageNotFound'));
});

// error handling middleware it renders error.ejs
app.use((err, req, res, next) => {
  const {statusCode = 400, message = "Something went wrong"} = err;
  res.status(statusCode).render("UI/error.ejs", {message});
  next();
});

// App to Listen
app.listen(port, (req, res) => {
  console.log("App Listening");
});