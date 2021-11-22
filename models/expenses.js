const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expensesSchema = new Schema(
  {
    user_id: { type: String, required: true },
    expense_name: { type: String, required: true },
    amount: { type: Number, required: true },
    remarks: { type: String },
    category_id: { type: String },
    date: { type: Date },
  },
  {
    timestamps: true,
    collection: "expenses",
  }
);
const Expenses = mongoose.model("expenses", expensesSchema);
module.exports = { Expenses };
