const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expenseCategoriesSchema = new Schema(
  {
    user_id: { type: String, required: true },
    category_name: { type: String, required: true },
    remarks: { type: String },
  },
  {
    timestamps: true,
    collection: "expense_categories",
  }
);
const ExpenseCategories = mongoose.model(
  "expense_categories",
  expenseCategoriesSchema
);
module.exports = { ExpenseCategories };
