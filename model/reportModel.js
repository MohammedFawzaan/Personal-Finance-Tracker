const mongoose = require('mongoose');

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
    }
});

const Reports = mongoose.model('Reports', reportsSchema);

module.exports = Reports;