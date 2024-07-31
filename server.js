const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
const mongoose = require('mongoose');

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

// middleware for Routes.
app.use('/', require('./routes/myRoute'));
app.use('/', require('./routes/reportRoute'));
app.use('/', require('./routes/expensesRoute'));

// if user enters wrong route enter
app.all('*', (req, res, next) => {
  next(new ExpressError('404', 'PageNotFound'));
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