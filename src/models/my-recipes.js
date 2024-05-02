const mongoose = require("mongoose");

const postNewRecipe = mongoose.Schema(
  {
    name: { type: String, require: true, unique: true, trim: true },
    auth: {
      author: { type: String, require: true },
      date: { type: String, require: true },
      authorId: { type: String, require: true },
    },
    dish: { type: String, require: [true, "You need to specify type of dish"] },
    difficult: { type: String, require: true },
    prepTime: { type: Number, require: true },
    cookTime: { type: Number, require: true },
    serves: { type: Number, require: true },
    nutritions: {
      calories: { type: Number, require: true },
      fat: { type: Number, require: true },
      carbohydrate: { type: Number, require: true },
      protein: { type: Number, require: true },
    },
    votes: {
      likes: { type: Array },
      dislikes: { type: Array },
    },
    photos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photos",
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NewRecipe = mongoose.model("NewRecipe", postNewRecipe);

module.exports = NewRecipe;
