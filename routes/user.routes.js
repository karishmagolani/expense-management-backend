const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/", userController.get_all_users);
router.post("/register", userController.register_user);
router.post("/login", userController.login_user);
router.get("/me", userController.get_current_user);

module.exports = router;
