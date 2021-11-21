const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = process.env.JWT_SECRET;

const get_all_users = (req, res) => {
  User.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res
        .status(400)
        .send(`There is an error in the server while loading projects`);
    });
};

const register_user = async (req, res) => {
  const user = req.body;
  console.log("req", req.body);
  const isUser = await User.findOne({ email: user.email });
  if (isUser) {
    return res.status(500).send({ message: "Email already registered" });
  } else {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        return res.status(500).send({ message: "Error in registering user." });
      }
      console.log("err", err);
      const dbUser = new User({
        email: user.email.toLowerCase(),
        password: hash,
        name: user.name,
      });
      dbUser.save(function (err) {
        if (err) {
          console.error("err in post", err);
          return res
            .status(500)
            .send({ message: "Error in registering user." });
        } else {
          res.json({ message: "success" });
        }
      });
    });
  }
};

const login_user = async (req, res) => {
  const user = req.body;
  User.findOne({ email: user.email }).then((userFound) => {
    if (!userFound) {
      return res.status(500).send({ message: "Invalid username or password" });
    }
    bcrypt.compare(user.password, userFound.password).then((success) => {
      const payload = {
        id: userFound._id,
        email: user.email,
        name: userFound.name,
      };
      if (success) {
        jwt.sign(payload, secret, {}, function (err, token) {
          if (err) {
            return res.status(500).send({ message: err });
          }
          return res.json({ message: "Success", token: `Bearer ${token}` });
        });
      } else {
        return res
          .status(400)
          .send({ message: "Invalid username or password" });
      }
    });
  });
};

const verify_user = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.status(500).send({ message: err });
      }
      console.log(decoded);
      const user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };
      req.user = user;
      next();
    });
  } else {
    return res.status(500).send({ message: "Incorrect token provided" });
  }
};

const get_current_user = (req, res) => {
  verify_user(req, res, () =>
    res.json({ email: req.user.email, name: req.user.name })
  );
};

module.exports = {
  get_all_users,
  register_user,
  login_user,
  verify_user,
  get_current_user,
};
