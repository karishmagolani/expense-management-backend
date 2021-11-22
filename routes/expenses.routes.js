const express = require("express");
const expenseController = require("../controllers/expenses.controller");

const router = express.Router();

router.get("/", expenseController.get_all_expenses);
router.post("/add", expenseController.add_expense);
router.post("/filter", expenseController.get_expenses_by_filters);

module.exports = router;
