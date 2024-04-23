const express = require("express");

const NewRecipes = require("../models/my-recipes");

const router = express.Router();

router.get("", (req, res, next) => {
  const recipe = NewRecipes.find({ published: true });

  recipe.then((doc) => {
    res.status(200).send(doc);
  });
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { personId, action } = req.body;

    const query = await NewRecipes.findOne({ _id: id });
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
    res.status(201).json(query);
  } catch (err) {
    res.status(404).json(err.message);
  }
});

module.exports = router;
