const User = require('../model/newUserModel'); 
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');
require('dotenv').config();

const Signup = (req, res) => {
    res.render('UI/signup.ejs');
};

const Register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new ExpressError(400, "Fill all details");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        throw new ExpressError(404, "User Already registered");
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashpassword
    });

    await newUser.save();

    if (newUser) {
        // Log in the user directly after successful signup
        const accessToken = jwt.sign(
            {
                userAvailable: {
                    username: newUser.username,
                    email: newUser.email,
                    id: newUser.id
                }
            },
            process.env.JWT_SECRET || "fawzaan123",
            { expiresIn: "15m" }
        );
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

const LoginGet = (req, res) => {
    res.render("UI/login.ejs");
};

const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ExpressError(400, 'Email or password incorrect');
    }
    const userAvailable = await User.findOne({ email });

    if (userAvailable && (await bcrypt.compare(password, userAvailable.password))) {
        const accessToken = jwt.sign(
            {
                userAvailable: {
                    username: userAvailable.username,
                    email: userAvailable.email,
                    id: userAvailable.id
                }
            }, 
            process.env.JWT_SECRET || "fawzaan123",
            { expiresIn: "15m" }
        );
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 365 * 24 * 60 * 60 * 1000 // 2 years
        });
        res.redirect('/home');
    } else {
        req.flash("error", "Email or Password incorrect");
        res.redirect('/login');
    }
});

const Current = asyncHandler(async (req, res) => {
    res.json(req.userAvailable);
});

const Logout = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    req.flash("error", "You are Logged Out");
    res.redirect('/login'); // Redirect to the login page after logout
};

module.exports = { LoginGet, Signup, Register, Login, Current, Logout };