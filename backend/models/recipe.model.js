const mongoose = require("mongoose");
const ProfileSchema = require("./profile.model.js");
const CommentSchema = require("./comment.model");

const RecipeSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
  ingredients: [
    {
      ingredientName: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: false,
      },
    },
  ],
  images: [],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: CommentSchema,
    },
  ],
  method: String,
  cookingTime: {
    type: Number,
    required: true,
  },
  nutrition: String,
  hardLevel: {
    type: String,
    required: true,
    enum: ["very-easy", "easy", "hard", "very-hard"],
    default: "easy",
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ProfileSchema,
  },
  state: {
    type: String,
    required: true,
    enum: ["deleted", "inactive", "processing", "active"],
    default: "active",
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
