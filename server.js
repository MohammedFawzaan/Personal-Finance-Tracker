const express = require('express');
const app = express();
const port = 4000;
const path = require('path');
const mongoose = require('mongoose');

const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

app.engine("ejs", ejsMate); // set ejsMate
app.set("view engine", "ejs"); // set views engine
app.set("views", path.join(__dirname, "views")); // views

// middlewares for static files etc
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/CSS")));
app.use(express.static(path.join(__dirname, "/public/JS")));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/FinanceApp');
    console.log("db connected");
}

app.use('/', require('./routes/myRoute'));
app.use('/', require('./routes/reportRoute'));
app.use('/', require('./routes/expensesRoute'));

app.listen(port, (req, res) => {
  console.log("App Listening");
});