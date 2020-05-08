module.exports = (app) => {
  const recipe = require("../controllers/recipes.controller.js");

  // Create a new Recipe
  app.post("/api/recipe", recipe.create);

  // Retrieve all Recipes
  app.get("/api/recipes", recipe.findAll);

  // Retrieve a single Recipe with RecipeId
  app.get("/api/recipe/:id", recipe.findOne);

  // Update a Recipe with RecipeID
  app.put("/api/recipe/:id", recipe.update);

  // Delete a Recipe with RecipeId
  app.delete("/api/recipe/:id", recipe.delete);

  // Retrieve Recipes with ingradients - related to
  app.post(
    "/api/findRecipesByAnyIngredients",
    recipe.findRecipesByAnyIngredients
  );

  // Retrieve Recipes with ingradients - exactly matches
  app.post(
    "/api/findRecipesByAllIngredients",
    recipe.findRecipesByAllIngredients
  );

  // Retrieve Recipes by name
  app.get("/api/recipeByName", recipe.findByRecipeName);

  // Retrieve Recipes by creator(profile)
  app.get("/api/recipeCreator/:userid", recipe.findByCreator);
};
