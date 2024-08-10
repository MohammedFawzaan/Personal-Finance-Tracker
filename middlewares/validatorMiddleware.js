const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware for authorization.
const validateToken = asyncHandler(async (req, res, next) => {
    // saving accessToken
    let token;
    // authHeader to set Headers when user interact in API tools(Hoppscotch).
    let authHeader = req.headers.authorization;

    // to check if accessToken is available in the cookie or authHeader(starting with bearer) or not.
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    // if token exists
    if (token) {
        try {
            // verifying token using jwt.verify() with JWT_SECRET;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // saving into req as req.userAvailable attribute.
            req.userAvailable = decoded.userAvailable;
            next();
        } // if token expires it catches error.
        catch(err) {
            req.flash("error", "Please Log-in to access");
            res.redirect('/login');
        }
    } else {
        req.flash("error", "Please log-in to access");
        res.redirect('/login');
    }
});

module.exports = validateToken;