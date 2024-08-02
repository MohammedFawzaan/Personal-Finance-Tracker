const Report = require('./routes/reportRoute');

const isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.flash("error", "Please Login");
        return res.redirect('/login');
    }
    next();
};

const isOwner = async(req, res, next) => {
    const { id } = req.params;
    let myReport = await Report.findById(id);
    if(!myReport.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this Report")
        return res.redirect(`/reports/${id}`);
    }
    next();
};

module.exports = isLoggedIn, isOwner;