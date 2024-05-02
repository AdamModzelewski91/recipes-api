const mongoose = require("mongoose");

const photos = mongoose.Schema({
  photos: [
    {
      originalname: String,
      encoding: String,
      size: Number,
      buffer: Buffer,
      mimetype: String,
    },
  ],
});

const Photos = mongoose.model("Photos", photos);

module.exports = Photos;
