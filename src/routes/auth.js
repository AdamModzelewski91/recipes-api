const express = require("express");

const Auth = require("../controllers/auth");

const router = express.Router();

router.get("/check-email", Auth.checkEmail);
router.get("/check-nick", Auth.checkNick);
router.post("/login", Auth.loginUser);

router.post("/signup", Auth.signupUser);

module.exports = router;
