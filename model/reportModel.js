const mongoose = require('mongoose');
const Expenses = require('./expensesModel');
const Schema = mongoose.Schema;

const reportsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: require('./newUserModel'),
    },
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
    currentBalance: {
        type: Number
    },
    createdAt :{
        type: Date,
        default: Date.now()
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