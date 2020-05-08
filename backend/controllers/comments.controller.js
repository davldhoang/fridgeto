const Comment = require("../models/comment.model.js");
const Recipe = require("../models/recipe.model.js");

// Create and Save a new Comment
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userName) {
    return res.status(400).send({
      message: "Comment content can not be empty",
    });
  }

  const comment = new Comment({
    userName: req.body.userName,
    commentDate: Date.now(),
    content: req.body.content,
    rate: req.body.rate || "3",
    state: "approved",
  });

  // comment.save()
  addComment2Recipe(req.params.recipeId, comment)
    .then((docComment) => {
      console.log("Add comment to recipe");

      res.send(docComment);
    })
    .catch((err) => {
      console.log("Error save comment: ", err.message);
    });
};

const addComment2Recipe = function (recipeId, comment) {
  return comment.save(comment).then((docComment) => {
    return Recipe.findByIdAndUpdate(
      recipeId,
      {
        $push: { comments: docComment._id },
      },
      { new: true, useFindAndModify: false }
    );
  });
};

// Retrieve and return comments of one recipe that has state: approved.
exports.findAll = (req, res) => {
  var recipeId = req.params.recipeId;
  Recipe.find({ _id: recipeId })
    .populate({ path: "comments", match: { state: "approved" } }) // Get whole recipe with full-comments
    .select({ comments: 1, _id: 0 }) // Project - receive only comment field
    // .where('state').equals('approved')
    .then((comments) => {
      res.send(comments);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving comment.",
      });
    });
};

//Retrieve all upapproved comments
exports.findUnapprovedComment = (req, res) => {
  var recipeId = req.params.recipeId;
  Recipe.find({ _id: recipeId })
    .populate({ path: "comments", match: { state: "unapproved" } }) // Get whole recipe with full-comments
    .select({ comments: 1, _id: 0 }) // Project - receive only comment field
    // .where('state').equals('approved')
    .then((comments) => {
      res.send(comments);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving comment.",
      });
    });
};

// Processing comment, setit's state to 'approved'
exports.approved = (req, res) => {
  // var state = req.params.state;
  Comment.findByIdAndUpdate(req.params.commentId, {
    state: "approved",
  })
    .then((docComment) => {
      res.send(docComment);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while approving comment.",
      });
    });
};

// Processing comment, setit's state to 'approved'
exports.delete = (req, res) => {
  // var state = req.params.state;
  Comment.findByIdAndUpdate(req.params.commentId, {
    state: "deleted",
  })
    .then((docComment) => {
      res.send(docComment);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while delete comment.",
      });
    });
};
