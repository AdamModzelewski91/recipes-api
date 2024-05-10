const NewRecipe = require("../models/my-recipes");
const Photos = require("../models/photos");

const APIFeatures = require("../utils/apiFeatures");
const PrepPhotoFiles = require("../utils/prepPhotoFiles");

exports.getRecipes = async (req, res) => {
  try {
    const { page, limit, sort, fields, ...queryObj } = req.query;
    const features = new APIFeatures(
      NewRecipe,
      page,
      limit,
      sort,
      fields,
      queryObj
    )
      .filter()
      .pagination()
      .limitFields();

    const recipes = await features.query;

    res.status(200).json(recipes);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.patchRecipe = async (req, res, next) => {
  try {
    let query = await NewRecipe.updateOne(
      { _id: req.params.id },
      {
        published: req.body.published,
        votes: {
          likes: [],
          dislikes: [],
        },
      }
    );
    if (query.acknowledged) {
      res.status(200).send(req.body);
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    let query = await NewRecipe.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Recipe deleted successfully!" });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.putRecipe = async (req, res, next) => {
  try {
    const nutritions = JSON.parse(req.body.nutritions);
    const { removedPhotos, photosAlbumId } = req.body;

    if (removedPhotos) {
      const arrPhotos = removedPhotos.split(",");
      const objPhoto = arrPhotos.map((x) => ({
        _id: x,
      }));

      const deletePhotos = {
        $pull: {
          photos: { _id: { $in: objPhoto } },
        },
      };

      await Photos.updateOne({ _id: photosAlbumId }, deletePhotos);
    }

    if (req.files.length > 0) {
      const files = new PrepPhotoFiles(req.files).toArray();

      const addPhotos = {
        $push: {
          photos: { $each: files },
        },
      };

      await Photos.updateOne({ _id: photosAlbumId }, addPhotos);
    }

    const obj = {
      name: req.body.name,
      dish: req.body.dish,
      difficult: req.body.difficult,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      serves: req.body.serves,
      nutritions: {
        calories: nutritions.calories,
        fat: nutritions.fat,
        carbohydrate: nutritions.carbohydrate,
        protein: nutritions.protein,
      },
    };

    const query = await NewRecipe.findOneAndUpdate({ _id: req.params.id }, obj);

    const queryPhotos = await Photos.findOne({ _id: photosAlbumId });

    const newPhotos = new PrepPhotoFiles(queryPhotos.photos).encodeFiles();

    res.status(200).send({
      ...obj,
      id: req.params.id,
      photos: newPhotos,
      photosAlbumId: query.photosAlbumId,
      published: query.published,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.postRecipe = async (req, res, next) => {
  try {
    const nutritions = JSON.parse(req.body.nutritions);

    const files = new PrepPhotoFiles(req.files).toArray();

    const photos = await Photos.create({ photos: files });

    await photos.save();

    let query = await NewRecipe.create({
      name: req.body.name,
      dish: req.body.dish,
      difficult: req.body.difficult,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      serves: req.body.serves,
      createdBy: {
        author: req.body.author,
        authorId: req.body.authorId,
      },
      nutritions: nutritions,
      photosAlbumId: photos._id,
    });

    res.status(201).json({
      message: "Recipe added successfully!",
      id: query._id,
      photosAlbumId: photos._id,
      published: query.published,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
