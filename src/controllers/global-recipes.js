const MyRecipes = require("../models/my-recipes");

const APIFeatures = require("../utils/apiFeatures");

exports.getRecipes = async (req, res, next) => {
  try {
    const { page, limit, sort, fields, ...queryObj } = req.query;

    const features = new APIFeatures(
      MyRecipes,
      page,
      limit,
      sort,
      fields,
      queryObj
    )
      .globalList()
      .pagination()
      .limitFields();

    const query = await features.query;
    const count = await MyRecipes.countDocuments({
      published: true,
    });

    res.status(200).json({ recipes: query, count: count });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.patchVote = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { personId, action } = req.body;

    const query = await MyRecipes.findOne({ _id: id });
    const liked = query.votes.likes.indexOf(personId);
    const disliked = query.votes.dislikes.indexOf(personId);

    switch (true) {
      case action === "like" && disliked !== -1:
        query.votes.likes.push(personId);
        query.votes.dislikes.splice(liked, 1);
        break;
      case action === "like" && liked === -1:
        query.votes.likes.push(personId);
        break;
      case action === "like" && liked !== -1:
        query.votes.likes.splice(liked, 1);
        break;
      case action === "dislike" && liked !== -1:
        query.votes.dislikes.push(personId);
        query.votes.likes.splice(liked, 1);
        break;
      case action === "dislike" && disliked === -1:
        query.votes.dislikes.push(personId);
        break;
      case action === "dislike" && disliked !== -1:
        query.votes.dislikes.splice(liked, 1);
        break;
      default:
        query.votes.likes.splice(liked, 1);
        query.votes.dislikes.splice(liked, 1);
        break;
    }

    query.save();
    res.status(201).json({ votes: query.votes });
  } catch (err) {
    res.status(404).json(err.message);
  }
};
