const express = require("express");

const MyRecipes = require("../controllers/my-recipes");

const Multer = require("../middlewares/mime-type");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router
  .get("", checkAuth, MyRecipes.getRecipes)
  .post("", checkAuth, Multer.MimeType, MyRecipes.postRecipe);

router
  .patch("/:id", checkAuth, MyRecipes.patchRecipe)
  .put("/:id", checkAuth, Multer.MimeType, MyRecipes.putRecipe)
  .delete("/:id", checkAuth, MyRecipes.deleteRecipe);

module.exports = router;
