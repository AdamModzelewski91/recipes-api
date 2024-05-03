const express = require("express");
const Photos = require("../controllers/photos");

const router = express.Router();

router.get("/:id", Photos.getPhotos);

module.exports = router;
