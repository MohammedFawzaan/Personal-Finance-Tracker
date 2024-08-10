const User = require('../model/newUserModel'); 
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');
require('dotenv').config();

// signup get route.
const Signup = (req, res) => {
    res.render('UI/signup.ejs');
};

// signup (Register route)
const Register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new ExpressError(400, "Fill all details");
    }
    // finding user from its email.
    // to check if he is already registered.
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        throw new ExpressError(404, "User Already registered");
    }
    // hashpassword using bycryt.hash(password, 10).
    const hashpassword = await bcrypt.hash(password, 10);

    // creating & saving newUser
    const newUser = new User({
        username,
        email,
        password: hashpassword
    });
    await newUser.save();

    // Log in the user directly after successful signup
    if (newUser) {
        // creating accesstoken using jwt.sign() with JWT_SECRET.
        const accessToken = jwt.sign(
            {
                userAvailable: {
                    username: newUser.username,
                    email: newUser.email,
                    id: newUser.id
                }
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        // storing data into web-cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000
        });
        res.redirect('/home');
    } else {
        res.redirect('/signup');
    }
});

// login get route
const LoginGet = (req, res) => {
    res.render("UI/login.ejs");
};

// login post route
const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ExpressError(400, 'Email or password incorrect');
    }
    // finding user
    const userAvailable = await User.findOne({ email });
    // comparing user password and password which user entered on site.
    if (userAvailable && (await bcrypt.compare(password, userAvailable.password))) {
        // creating accesstoken using jwt.sign() with JWT_SECRET.
        const accessToken = jwt.sign(
            {
                userAvailable: {
                    username: userAvailable.username,
                    email: userAvailable.email,
                    id: userAvailable.id
                }
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        // Saving data in web-cookie in form of accessToken, which has generated.
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            maxAge: 2 * 365 * 24 * 60 * 60 * 1000 // 2 years
        });
        res.redirect('/home');
    } else {
        req.flash("error", "Email or Password incorrect");
        res.redirect('/login');
    }
});

// current user get route
const Current = asyncHandler(async (req, res) => {
    res.json(req.userAvailable);
});

// logout get route
const Logout = (req, res) => {
    // clearing cookie, so that accessToken expires
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV
    });
    req.flash("error", "You are Logged Out");
    res.redirect('/login'); // Redirect to the login page after logout
};

module.exports = { LoginGet, Signup, Register, Login, Current, Logout };