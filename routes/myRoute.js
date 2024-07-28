const express = require('express');
const router = express.Router();

router.get('/home', async(req, res) => {
    res.render("UI/home.ejs");
});

router.get('/signup', (req, res) => {
    res.render('UI/signup.ejs');
});

router.get('/login', (req, res) => {
    res.render('UI/login.ejs');
});

module.exports = router;