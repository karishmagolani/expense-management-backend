const express = require("express");
const expenseCategoriesController = require("../controllers/expense_categories.controller");

const router = express.Router();

router.get("/", expenseCategoriesController.get_all_categories);
router.post("/add", expenseCategoriesController.add_category);

module.exports = router;
