const User = require('../model/newUserModel'); 
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');

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
            "fawzaan123",
            { expiresIn: "15m" }
        );
        res.json({accessToken }); // Send the token in the JSON response
    } else {
        throw new ExpressError(401, "Details Not Valid");
    }
});

const Current = asyncHandler(async (req, res) => {
    res.json(req.userAvailable);
});

module.exports = { LoginGet, Signup, Register, Login, Current };