const Photos = require("../models/photos");

const PerpPhotoFiles = require("../utils/perpPhotoFiles");

exports.getPhotos = async (req, res, next) => {
  try {
    const id = req.params.id;

    const query = await Photos.findOne({ _id: id });

    const newPhotos = new PerpPhotoFiles(query.photos).encodeFiles();

    res.status(200).send(newPhotos);
  } catch (err) {
    res.status(404).send(err.message);
  }
};
