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
    console.log("USER", req.user, req.body);
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
  console.log("HERE", category_ids, req.body);
  verify_user(req, res, () => {
    console.log("HERE", category_ids);

    var query = {
      user_id: req.user.id,
    };
    if (category_ids) {
      query.category_id = { $in: category_ids };
    }
    if (date) {
      query.date = {
        $gte: new Date(date.gte).toISOString(),
        $lt: new Date(date.lt).toISOString(),
      };
    }
    console.log("QUERY", query);
    Expenses.find(query)
      .sort({ date: order == "asc" ? 1 : -1 })
      .then(async (result) => {
        await Promise.all(
          result.map(async (item, index) => {
            const newItem = item;

            const category = item.category_id
              ? await ExpenseCategories.findOne({
                  _id: item.category_id,
                })
              : null;
            result[index] = { ...newItem._doc, category };
          })
        );
        console.log("----", result);
        return res.send(result);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
      });
  });
};

module.exports = { get_all_expenses, add_expense, get_expenses_by_filters };
