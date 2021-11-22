const { ExpenseCategories } = require("../models/expense_categories");
const { verify_user } = require("./user.controller");

const get_all_categories = (req, res) => {
  const user = req.body;
  verify_user(req, res, () => {
    console.log("USER", req.user);
    ExpenseCategories.find({ user_id: req.user.id })
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

const add_category = (req, res) => {
  const { category_name, remarks } = req.body;
  verify_user(req, res, () => {
    console.log("USER", req.user);
    const newCategory = new ExpenseCategories({
      user_id: req.user.id,
      category_name: category_name,
      remarks: remarks,
    });
    newCategory.save(function (err) {
      if (err) {
        console.error("err in post", err);
        return res.status(500).send({ message: "Error in adding expense." });
      } else {
        res.json({ message: "success" });
      }
    });
  });
};

module.exports = {
  get_all_categories,
  add_category,
};
