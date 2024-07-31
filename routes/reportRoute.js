const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const asyncHandler = require('express-async-handler');

const ExpressError = require('../utils/ExpressError')
const Reports = require('../model/reportModel');

// Get All Reports 
// Route /reports
router.get('/reports', async(req, res) => {
    let reports = await Reports.find({});
    res.render("UI/reports.ejs", {reports});
});

// Get create report
// Route /newreport
router.get('/newreport', (req, res) => {
    res.render('UI/newreport.ejs');
});

// Get particular report
// Route /reports/:id
router.get('/reports/:id', asyncHandler(async(req, res) => {
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
router.post('/reports', async (req, res) => {
    let { name, incomeAmount, description} = req.body;
    // creating new Report in db
    let newReport = new Reports({
        name: name,
        incomeAmount: incomeAmount,
        description: description
    }); 
    // console.log(newReport);
    await newReport.save();
    res.redirect('/reports');
});

// Delete a Report
// /reports/:id
router.delete('/reports/:id', asyncHandler(async(req, res) => {
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    await Reports.findByIdAndDelete(id);
    res.redirect('/reports');
}));

module.exports = router;