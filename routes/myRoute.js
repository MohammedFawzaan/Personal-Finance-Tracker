const express = require('express');
const router = express.Router();

router.get('/home', async(req, res) => {
    // console.log(req.userAvailable);
    res.render('UI/home.ejs', { user: req.userAvailable });
});

router.get('/signup', (req, res) => {
    res.render('UI/signup.ejs');
});

router.get('/login', (req, res) => {
    res.render('UI/login.ejs');
});

module.exports = router;