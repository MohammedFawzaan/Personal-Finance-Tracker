const express = require('express');
const router = express.Router();

const Reports = require('../model/reportModel');
const Expenses = require('../model/expensesModel');

// Get /newexpenses
router.get('/newexpenses/:id', async(req, res) => {
    let {id} = req.params;
    let report = await Reports.findById(id);
    res.render('UI/newexpenses.ejs', {report});
});

router.post('/reports/:id/expenses', async(req, res) => {
    let {id} = req.params;
    let report = await Reports.findById(id);

    let {category, amount} = req.body;
    let newExpense = new Expenses({
        category: category,
        amount: amount
    });
    console.log(newExpense);

    report.expenses.push(newExpense);
    await newExpense.save();
    await report.save();

    res.redirect(`/reports/${report._id}`);
});

module.exports = router;