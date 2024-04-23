require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const serverless = require("serverless-http");

const myRecipes = require("./routes/my-recipes");
const globalRecipes = require("./routes/global-recipes");

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
app.use("/photos", express.static(path.join("photos")));

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

app.use("/my-recipes", myRecipes);
app.use("/global-recipes", globalRecipes);

module.exports = app;
