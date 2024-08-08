const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Reports = require('../model/reportModel');
const Expenses = require('../model/expensesModel');
const User = require('../model/newUserModel');

const validateToken = require('../middlewares/validatorMiddleware');

// Get Expenses
// Route /newexpenses/:id
router.get('/newexpenses/:id', validateToken, asyncHandler(async(req, res) => {
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
router.post('/reports/:id/expenses', validateToken, asyncHandler(async(req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    // Finding that report through its id
    let report = await Reports.findById(id);
    let { category, amount } = req.body;
    // Calculate the new balance if the expense is added
    let newBalance = report.currentBalance - amount;
    // Check if the new balance is negative
    if (newBalance < 0) {
        req.flash("error", "You are out of Balance");
        return res.redirect(`/reports/${id}`);  // Redirect to the report page
    }
    // Create a new expense if there is enough balance
    let newExpense = new Expenses({
        category: category,
        amount: amount
    });
    // Update the report's current balance
    report.currentBalance = newBalance;
    // Push newExpense to report.expenses field and save both newExpense and report
    report.expenses.push(newExpense);
    await newExpense.save();
    await report.save();
    // Redirect to the report page
    res.redirect(`/reports/${id}`);
}));


// parent/:parentId/child/:childId
router.delete('/reports/:id/expenses/:expenseId', validateToken, asyncHandler(async(req, res) => {
    let {id, expenseId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Id not found");
    }
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        throw new ExpressError(404, "Id not found");
    }
    let myexpense = await Expenses.findById(expenseId);
    let myreport = await Reports.findById(id);
    if (!myexpense || !myreport) {
        throw new ExpressError(404, "Expense or Report not found");
    }
    // adding expenses amount which have been deleted from expenses list
    myreport.currentBalance += myexpense.amount;
    await myreport.save(); // Save the updated report

    // Updating parent collection 
    await Reports.findByIdAndUpdate(id, {$pull :{expenses: expenseId}});
    // deleting expense from Expenses Collection.
    await Expenses.findByIdAndDelete(expenseId);
    res.redirect(`/reports/${id}`);
}));

module.exports = router;