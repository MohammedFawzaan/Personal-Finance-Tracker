const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/FinanceApp');
    console.log("DB connected");
}

// Import the models
const report = require('./model/reportModel'); // Ensure this path is correct
const Expenses = require('./model/expensesModel'); // Ensure this path is correct

const fun1 = async () => {
    const myReport = new report({
        name: "Day1",
        incomeAmount: 10000,
        description: "Salary"
    });
    
    const newExpense = new Expenses({
        amount: 200,
        category: "Movie"
    });
    await newExpense.save();
    
    // pushing newExpense in expenses field.
    myReport.expenses.push(newExpense);

    await myReport.save();
    console.log("report saved successfully");
};

fun1();


// // deleting customer and his orders
// const deleteCustomer = async() => {
//     // id of customer to be deleted.
//     let res = await Customer.findByIdAndDelete('66a54aea29a8183120c6832a');
//     console.log(res);
// };
// deleteCustomer();

// // Handling Deletions
// customerSchema.post("findOneAndDelete", async(customer)=>{
//     if(customer.orders.length) {
//         let result = await Order.deleteMany({_id : { $in : customer.orders }});
//         console.log(result);
//     }
// });