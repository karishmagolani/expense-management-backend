const { Expenses } = require("../models/expenses");
const { ExpenseCategories } = require("../models/expense_categories");
const jwt = require("jsonwebtoken");
const { verify_user } = require("./user.controller");

const get_all_expenses = (req, res) => {
  const user = req.body;
  verify_user(req, res, () => {
    console.log("USER", req.user);
    Expenses.find({ user_id: req.user.id })
      .sort({ createdAt: -1 })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res
          .status(400)
          .send(`There is an error in the server while loading projects`);
      });
  });
};

const add_expense = (req, res) => {
  const { expense_name, amount, remarks, category_id, date } = req.body;
  verify_user(req, res, () => {
    console.log("USER", req.user);
    const newExpense = new Expenses({
      user_id: req.user.id,
      expense_name: expense_name,
      amount: amount,
      remarks: remarks,
      category_id: category_id,
      date: date,
    });
    newExpense.save(function (err) {
      if (err) {
        console.error("err in post", err);
        return res.status(500).send({ message: "Error in adding expense." });
      } else {
        res.json({ message: "success" });
      }
    });
  });
};

const get_expenses_by_filters = (req, res) => {
  const { category_ids, date, skip, limit, order } = req.body;
  console.log("HERE", req.body);
  verify_user(req, res, () => {
    Expenses.find({ user_id: req.user.id, category_id: category_ids })
      .then((res) => {
        console.log(res);
        Promise.all(
          res.map(async (item) => {
            if (item.category_id)
              ExpenseCategories.findOne({ _id: item.category_id }).then(
                (category) => {
                  console.log("id", item.category_id, category);

                  console.log(category);
                }
              );
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = { get_all_expenses, add_expense, get_expenses_by_filters };
