const mongoose = require('mongoose');
const Expenses = require('./expensesModel');

const Schema = mongoose.Schema;

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
            ref: require('./expensesModel')
        }
    ],
    createdAt :{
        type: Date,
        default: Date.now()
    },
    owner: {
        type: Schema.Types.ObjectId,
        refs: require('./userModel')
    }
});

const Reports = mongoose.model('Reports', reportsSchema);

// middleware to delete all expenses info related to that particular report.
reportsSchema.post('findOneAndDelete', async(reports) => {
    if(reports) {
        await Expenses.deleteMany({_id: {$in : reports.expenses}});
    }
});

module.exports = Reports;