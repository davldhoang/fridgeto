module.exports = (app) => {
  const comment = require("../controllers/comments.controller.js");

  // Create a new Note
  app.post("/api/comment/:recipeId", comment.create);

  // Retrieve all approved comments
  app.get("/api/comment/:recipeId", comment.findAll);

  // Retrieve all unapproved comments
  app.get("/api/ucomment/:recipeId", comment.findUnapprovedComment);

  //approve a comment
  app.put("/api/comment/:commentId", comment.approved);

  //delete a comment
  app.delete("/api/comment/:commentId", comment.delete);
};
