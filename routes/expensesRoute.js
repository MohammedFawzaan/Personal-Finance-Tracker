const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const asyncHandler = require('express-async-handler');

const Reports = require('../model/reportModel');
const Expenses = require('../model/expensesModel');

// Get Expenses
// Route /newexpenses/:id
router.get('/newexpenses/:id', asyncHandler(async(req, res) => {
    let {id} = req.params; // report id.
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    // populate method to display expenses related to that report.
    let report = await Reports.findById(id).populate('expenses');
    res.render('UI/newexpenses.ejs', {report});
}));

// Post Create Expense.
// /parent/:parentId/child
// Route /reports/:id/expenses // as report id is required.
router.post('/reports/:id/expenses', asyncHandler(async(req, res) => {
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    // Finding that report through its id
    let report = await Reports.findById(id);

    let {category, amount} = req.body;
    // create an expense for that report
    let newExpense = new Expenses({
        category: category,
        amount: amount
    });
    // push newExpense to report.expense Field.
    report.expenses.push(newExpense);
    // saving the newExpense in both Report and Expense.
    await newExpense.save();
    await report.save();
    // redirecting to that particular report route.
    res.redirect(`/reports/${id}`);
}));

// parent/:parentId/child/:childId
router.delete('/reports/:id/expenses/:expenseId', asyncHandler(async(req, res) => {
    let {id, expenseId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        throw new ExpressError(404, "Id not found");
    }
    // Updating parent collection 
    await Reports.findByIdAndUpdate(id, {$pull :{expenses: expenseId}});
    // deleting expense from Expenses Collection.
    await Expenses.findByIdAndDelete(expenseId);
    res.redirect(`/reports/${id}`);
}));

module.exports = router;