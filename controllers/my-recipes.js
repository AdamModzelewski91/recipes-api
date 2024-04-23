const NewRecipe = require("../models/my-recipes");

const APIFeatures = require("../utils/apiFeatures");

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
      res.status(201).send(req.body);
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
    if (query.acknowledged) {
      res.status(204).send();
    }
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
    const { publishedPhotos } = req.body;

    const newPhotos = publishedPhotos.split(",");

    const url = req.protocol + "://" + req.get("host");

    req.files.forEach((file) => {
      const path = url + "/" + file.path;
      newPhotos.push(path);
    });

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
      photos: newPhotos,
      published: req.body.published,
    };

    let query = await NewRecipe.updateOne({ _id: req.params.id }, obj);

    if (query.acknowledged) {
      res.status(201).send({ ...obj, id: req.params.id });
    }
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
    const url = req.protocol + "://" + req.get("host");
    const urls = [];
    req.files.forEach((file) => {
      const path = url + "/" + file.path;
      urls.push(path);
    });
    console.log(urls);
    let query = await NewRecipe.create({
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
      photos: urls,
    });

    res.status(201).json({
      message: "Recipe added successfully!",
      id: query._id,
      photos: urls,
      published: query.published,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
