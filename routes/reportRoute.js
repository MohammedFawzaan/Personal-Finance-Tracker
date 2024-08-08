const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const ExpressError = require('../utils/ExpressError')
const Reports = require('../model/reportModel');

// const validateToken = require('../middleware/validatorMiddleware');
const validateToken = require('../middlewares/validatorMiddleware');

// Get All Reports 
// Route /reports
router.get('/reports', validateToken, async(req, res) => {
    let reports = await Reports.find({user_id: req.userAvailable.id});
    res.render("UI/reports.ejs", {reports});
});

// Get create report
// Route /newreport
router.get('/newreport', validateToken, (req, res) => {
    res.render('UI/newreport.ejs');
});

// Get particular report
// Route /reports/:id
router.get('/reports/:id', validateToken, asyncHandler(async(req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    // populate function used here to display expenses related to this report.
    let myReport = await Reports.findById(id).populate({ path: "expenses", options: { strictPopulate: false } });
    if(!myReport) {
        throw new ExpressError(404, "Not Found");
    }
    res.render('UI/onereport', {myReport});
}));

// Post create report
// Route /reports
router.post('/reports', validateToken, async (req, res) => {
    let { name, incomeAmount, description} = req.body;
    // validation
    if(!name || !incomeAmount || !description) {
        throw new ExpressError(400, "All Fields Mandatory");
    }
    // creating new Report in db
    let newReport = new Reports({
        user_id: req.userAvailable.id,
        name: name,
        incomeAmount: incomeAmount,
        description: description,
        currentBalance: incomeAmount
    }); 
    await newReport.save();
    // req.flash("success", "New Report Created");
    res.redirect('/reports');
});

// Delete a Report
// /reports/:id
router.delete('/reports/:id', validateToken, asyncHandler(async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) 
        throw new ExpressError(404, "Id not found");
    
    let report = await Reports.findById(id);
    if (!report) 
        throw new ExpressError(404, "Report not found");
    if (report.user_id.toString() !== req.userAvailable.id)
        throw new ExpressError(403, "User does not have permission to delete this report");

    await Reports.findByIdAndDelete(id);
    res.redirect('/reports');
}));

module.exports = router;