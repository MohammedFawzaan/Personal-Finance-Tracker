const mongoose = require('mongoose');

const schema = mongoose.Schema;

const expensesSchema = new schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;