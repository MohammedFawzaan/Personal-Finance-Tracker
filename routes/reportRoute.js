const express = require('express');
const router = express.Router();

const Reports = require('../model/reportModel');

// Get all reports 
// /reports
router.get('/reports', async(req, res) => {
    let reports = await Reports.find({});
    res.render("UI/reports.ejs", {reports});
});

// Get create report
// /newreport
router.get('/newreport', (req, res) => {
    res.render('UI/newreport.ejs');
});

// Get particular report
// /reports/:id
router.get('/reports/:id', async(req, res) => {
    const {id} = req.params;
    let myReport = await Reports.findById(id);
    res.render('UI/onereport', {myReport});
});

// Post create report
// /reports
router.post('/reports', async (req, res) => {
    let { name, incomeAmount, description} = req.body;
    let newReport = new Reports({
        name: name,
        incomeAmount: incomeAmount,
        description: description
    }); 
    console.log(newReport);
    await newReport.save();
    res.redirect('/reports');
});

// Delete a Report
// /reports/:id
router.delete('/reports/:id', async(req, res) => {
    let {id} = req.params;
    await Reports.findByIdAndDelete(id);
    res.redirect('/reports');
});

module.exports = router;