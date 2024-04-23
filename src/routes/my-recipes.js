const express = require("express");

const MyRecipes = require("../controllers/my-recipes");

const Multer = require("../middlewares/mime-type");

const router = express.Router();

router.route("/top-5");

router
  .get("", MyRecipes.getRecipes)
  .post("", Multer.MimeType, MyRecipes.postRecipe);

router
  .patch("/:id", MyRecipes.patchRecipe)
  .put("/:id", Multer.MimeType, MyRecipes.putRecipe)
  .delete("/:id", MyRecipes.deleteRecipe);

module.exports = router;
