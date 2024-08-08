const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, "fawzaan123");
            req.userAvailable = decoded.userAvailable;
            next();
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    } else {
        req.flash("error", "Please log-in to access");
        res.redirect('/login');
    }
});

module.exports = validateToken;