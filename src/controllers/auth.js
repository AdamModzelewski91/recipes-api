const Auth = require("../models/auth");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

exports.loginUser = (req, res, next) => {
  let userAuth;
  Auth.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      userAuth = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      const token = jwt.sign(
        { email: userAuth.email, nick: userAuth.nick, userId: userAuth._id },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        token,
        userId: userAuth._id,
        nick: userAuth.nick,
        expiresIn: new Date().getTime() + 1000 * 60 * 60 * 24,
      });
    })
    .catch((err) => {
      res.status(401).json({ status: "fail", message: err.message });
    });
};

exports.signupUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new Auth({
      email: req.body.email,
      nick: req.body.nick,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          result,
          message: "User created!",
        });
      })
      .catch((err) => {
        res.status(500).json({ status: "fail", message: err.message });
      });
  });
};
