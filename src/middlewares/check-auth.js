const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);
    req.userData = decodedJWT;
    next();
  } catch (error) {
    res
      .status(401)
      .send({
        errorCode: "INVALID_TOKEN",
        message: "Invalid or missing token",
      });
  }
};
