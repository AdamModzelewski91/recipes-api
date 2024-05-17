const mongoose = require("mongoose");

const postNewRecipe = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    createdBy: {
      author: { type: String, required: true },
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        require: true,
      },
    },
    dish: {
      type: String,
      required: [true, "You need to specify type of dish"],
    },
    difficult: { type: String, required: true },
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    serves: { type: Number, required: true },
    ingredients: { type: Array, required: true },
    instructions: { type: String, required: true },
    nutritions: {
      calories: { type: Number, required: true },
      fat: { type: Number, required: true },
      carbohydrate: { type: Number, required: true },
      protein: { type: Number, required: true },
    },
    votes: {
      likes: { type: Array },
      dislikes: { type: Array },
    },
    photosAlbumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photos",
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NewRecipe = mongoose.model("MyRecipes", postNewRecipe);

module.exports = NewRecipe;
