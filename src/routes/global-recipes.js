const express = require("express");

const GlobalRecipes = require("../controllers/global-recipes");

const router = express.Router();

router.get("", GlobalRecipes.getRecipes);

router.patch("/:id", GlobalRecipes.patchVote);

module.exports = router;
