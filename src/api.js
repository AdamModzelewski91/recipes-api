require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

const myRecipes = require("./routes/my-recipes");
const globalRecipes = require("./routes/global-recipes");
const photos = require("./routes/photos");
const auth = require("./routes/auth");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Adam:" +
      process.env.MONGODB_PW +
      "@cluster0.im9n0.mongodb.net/recipe-app"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/my-recipes", myRecipes);
app.use("/api/global-recipes", globalRecipes);
app.use("/api/photos", photos);
app.use("/api", auth);

module.exports.handler = serverless(app);
