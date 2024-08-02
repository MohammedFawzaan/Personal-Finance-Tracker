const express = require('express');
const User = require('../model/userModel');
const passport = require('passport');
const router = express.Router();

// router.get('/register', (req, res) => {
//     let {name} = req.query;
//     req.session.name = name;
//     // console.log(req.session);
//     // console.log(req.session.name);
//     req.flash("success", "User Registered");
//     res.redirect('/registerGet');
// });

// router.get('/registerGet', (req, res) => {
//     res.render("UI/home.ejs");
// });

router.get('/signup', (req, res) => {
    res.render('UI/signup.ejs');
});

router.post('/signup', async(req, res, next) => {
    try {
        // data from req.body
        let {username, email, password} = req.body;
        // creating newUser
        let newUser = new User({
            username: username,
            email: email
        });
        // register newUser using model.register(user, passwird) method
        let RegisteredUser = await User.register(newUser, password);
        // req.logIn to automatically login after signup.
        req.logIn(RegisteredUser, (err) => {
            if(err) return next(err);
            req.flash("success", "You are Registered");
            res.redirect('/home'); 
        });
        // console.log(RegisteredUser);
    } catch(e) {
        req.flash("error", "Try Again");
        res.redirect('/signup');
    }
});

router.get('/login', (req, res) => {
    res.render("UI/login.ejs");
});

router.post('/login',
    // middleware to login 
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async(req, res) => {
        req.flash("success", "Logged-In Successfully");
        res.redirect("/home");
    }
);

// logout route to destroy session and redirect back to login page
router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) return next(err);
    }),
    req.flash("success", "Logged Out");
    res.redirect("/home");
});

module.exports = router;