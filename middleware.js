const ExpressError = require('./utils/ExpressError');
const Reports = require('./routes/reportRoute');

// to ensure whether someone is LoggedIn or not
// [req.isAuthenticated()]

module.exports.isLoggedIn = async(req, res, next) => {
    // console.log(req.user);
    if(!req.isAuthenticated()) {
        req.flash("error", "Please Login");
        return res.redirect('/login');
    }
    next();
};

// // middleware/ownershipMiddleware.js

// module.exports.isOwner = async(req, res, next) => {
//     const { id } = req.params;
//     let report = await Reports.findById(id);
//     if(!report.owner.equals(res.locals.currentUser._id)) {
//         req.flash("error", "You are not the owner of this listing")
//         return res.redirect('/home');
//     }
//     next();
// }