const Recipe = require("../models/recipe.model.js");
const Comment = require("../models/comment.model.js");
// const mongoose = require('mongoose');

// Create and Save a new Recipe
exports.create = (req, res) => {
  // Validate request
  if (!req.body.recipeName) {
    return res.status(400).send({
      message: "recipe content can not be empty",
    });
  }

  // Create a Recipe
  const recipe = new Recipe({
    recipeName: req.body.recipeName,
    description: req.body.description,
    ingredients: req.body.ingredients,
    images: req.body.images,
    comments: [],
    method: req.body.method,
    cookingTime: req.body.cookingTime,
    nutrition: req.body.nutrition,
    hardLevel: req.body.hardLevel,
    createBy: req.body.createBy,
    state: req.body.state,
  });

  const lstIngredients = req.body.ingredients;
  const lstImages = req.body.images;

  var rec = recipe
    .save(recipe)
    .then(
      (docRecipe) => {
        // console.log("\n>> Created recipe:\n", docRecipe);
        lstIngredients.forEach((element) => {
          rec = addIngredient(recipe._id, {
            ingredientName: element.ingredientName,
            amount: element.amount,
          });
        });

        lstImages.forEach((img) => {
          rec = addImage(recipe._id, {
            url: img.url,
            caption: img.caption,
          });
        });
        console.log("Recipe save ", recipe);
        res.send(docRecipe);
      },
      (aa) => {
        console.log("Can not save with cause: ", aa.message);
        res.send(aa);
      }
    )
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Recipe.",
      });
    });
};

const addIngredient = function (recipeId, ingredient) {
  return Recipe.findByIdAndUpdate(
    recipeId,
    {
      $push: {
        ingredients: {
          ingredientName: ingredient.ingredientName,
          original: ingredient.original,
          description: ingredient.description,
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
};
const addImage = function (recipeId, img) {
  return Recipe.findByIdAndUpdate(
    recipeId,
    {
      $push: {
        images: {
          url: img.url,
          caption: img.caption,
        },
      },
    },
    { new: true, useFindAndModify: false }
  );
};

// Retrieve and return all recipes from the database.
exports.findAll = (req, res) => {
  Recipe.find()
    .populate({ path: "recipes", match: { state: "active" } })
    .then((recipess) => {
      res.send(recipess);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recipes.",
      });
    });
};

// Find a single recipe with a ingredientName
exports.findOne = (req, res) => {
  var id = req.params.id;
  Recipe.find({ _id: id })
    .populate({ path: "recipes", match: { state: "active" } })
    .then((ing) => {
      if (!ing) {
        return res.status(404).send({
          message: "Recipe not found  " + req.params.id,
        });
      }
      res.send(ing);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Recipe not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving recipe  " + req.params.id,
      });
    });
};

// Find recipes that contains specific ingredients (combine of all ingredient - exactly matches)
exports.findRecipesByAllIngredients = (req, res) => {
  // Accept an array of ingredients
  var criteria = req.body.ingredients;
  Recipe.find({ "ingredients.ingredientName": { $all: criteria } })
    .then((recipess) => {
      res.send(recipess);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recipes.",
      });
    });
};

// Find recipes that contains specific ingredients - related to
exports.findRecipesByAnyIngredients = (req, res) => {
  // Accept an array of ingredients
  var criteria = req.body.ingredients;
  Recipe.find({ "ingredients.ingredientName": criteria })
    .then((recipess) => {
      res.send(recipess);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recipes.",
      });
    });
};

// Find recipes by name
exports.findByRecipeName = (req, res) => {
  var criteria = req.body.recipename;
  Recipe.find({ recipeName: { $regex: ".*" + criteria + ".*", $options: "i" } })
    .then((recipess) => {
      res.send(recipess);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recipes.",
      });
    });
};

// Find recipes by creator
exports.findByCreator = (req, res) => {
  var criteria = req.params.userid;
  Recipe.find({ createBy: criteria })
    .then((recipess) => {
      res.send(recipess);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recipes.",
      });
    });
};

// Update a recipe identified by the recipeId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Recipe content can not be empty",
    });
  }

  // Find recipe and update it with the request body
  Recipe.findOneAndUpdate(
    { _id: req.params.id },
    {
      recipeName: req.body.recipeName,
      description: req.body.description,
      ingredients: req.body.ingredients,
      images: req.body.images,
      // comments: [],
      method: req.body.method,
      cookingTime: req.body.cookingTime,
      nutrition: req.body.nutrition,
      hardLevel: req.body.hardLevel,
      // createBy: req.body.createBy,
      // state: req.body.state,
    },
    { new: true }
  )
    .then((prf) => {
      if (!prf) {
        return res.status(404).send({
          message: "Recipe not found with id " + req.params.id,
        });
      }
      res.send(prf);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Recipe not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating recipe with id " + req.params.id,
      });
    });
};

// Delete a recipe with the specified recipeId in the request
exports.delete = (req, res) => {
  Recipe.findOneAndDelete({ _id: req.params.id }, (err, movie) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, error: `Recipe not found` });
    }

    return res.status(200).json({ success: true, data: movie });
  }).catch((err) => console.log(err));
};
