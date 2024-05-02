const express = require("express");

const Photos = require("../models/photos");

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const query = await Photos.findOne({ _id: id });

    const newPhotos = [];
    for (let photo of query.photos) {
      newPhotos.push({
        mimetype: photo.mimetype,
        buffer: Buffer.from(photo.buffer).toString("base64"),
        originalname: photo.originalname,
        id: photo._id,
      });
    }

    res.status(200).send(newPhotos);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
