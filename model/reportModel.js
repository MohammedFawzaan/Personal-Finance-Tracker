const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Expenses = require('./expensesModel');

const schema = mongoose.Schema;

const reportsSchema = new schema({
    name: {
        type: String,
        required: true
    },
    incomeAmount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    expenses: [
        {
            type: Schema.Types.ObjectId,
            refs: "Expenses"
        }
    ],
    createdAt :{
        type: Date,
        default: Date.now()
    }
});

const Reports = mongoose.model('Reports', reportsSchema);

module.exports = Reports;