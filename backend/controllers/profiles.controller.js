const Profile = require("../models/profile.model.js");

// Create and Save a new Profile
exports.create = (req, res) => {
  // Validate request,....
  if (!req.body.userName) {
    return res.status(400).send({
      message: "Profile content can not be empty",
    });
  }

  // Create a Profile
  const profile = new Profile({
    userName: req.body.userName,
    userPassword: req.body.userPassword,
    fullName: req.body.fullName,
    dob: req.body.dob,
    email: req.body.email,
    avatar: req.body.avatar || "",
    socialNetworkName: req.body.socialNetworkName || "",
    socialNetworkUserId: req.body.socialNetworkUserId || "",
    state: req.body.state,
    accoutType: req.body.accoutType,
    passwordResetToken: req.body.passwordResetToken || "",
  });

  // Save Profile in the database
  profile
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile.",
      });
    });
};

// Retrieve and return all profiles from the database.
exports.findActiveProfile = (req, res) => {
  Profile.find({ state: "active" })
    .then((prf) => {
      res.send(prf);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Profiles.",
      });
    });
};

// Retrieve and return all profiles from the database.
exports.findAll = (req, res) => {
  Profile.find()
    .then((prf) => {
      res.send(prf);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Profiles.",
      });
    });
};

// Find a single profile with a profileID
exports.findOne = (req, res) => {
  Profile.findOne({ _id: req.params.userid })
    .then((prf) => {
      if (!prf) {
        return res.status(404).send({
          message: "Profile not found with id " + req.params._id,
        });
      }
      res.send(prf);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Profile not found with id " + req.params._id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving note with id " + req.params._id,
      });
    });
};

// Update a profile identified by the profileId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Profile content can not be empty",
    });
  }

  // Find profile and update it with the request body
  Profile.findOneAndUpdate(
    { userName: req.params.username },
    {
      userName: req.body.userName,
      fullName: req.body.fullName,
      email: req.body.email,
      // avatar: req.body.avatar || "",
      // socialNetworkName: req.body.socialNetworkName || "",
      // socialNetworkUserId: req.body.socialNetworkUserId || "",
      // state: req.body.state,
      // accoutType: req.body.accoutType,
      // passwordResetToken: req.body.passwordResetToken || "",
      // notes: req.body.notes || "",
    },
    { new: true }
  )
    .then((prf) => {
      if (!prf) {
        return res.status(404).send({
          message: "Profile not found with id " + req.params.username,
        });
      }
      res.send(prf);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Profile not found with id " + req.params.username,
        });
      }
      return res.status(500).send({
        message: "Error updating profile with id " + req.params.username,
      });
    });
};

// Delete a profile with the specified profileId in the request
exports.delete = (req, res) => {
  // Profile.findByIdAndRemove(req.params._id)
  Profile.findOneAndUpdate(
    { userName: req.params.username },
    {
      state: "deleted",
    }
  )
    .then((prf) => {
      if (!prf) {
        return res.status(404).send({
          message: "Profile not found with id " + req.params._id,
        });
      }
      res.send({ message: "Profile deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Profile not found with id " + req.params._id,
        });
      }
      return res.status(500).send({
        message: "Could not delete Profile with id " + req.params._id,
      });
    });
};

// Login
exports.login = (req, res, next) => {
  Profile.authenticate(req.body.username, req.body.password, function (
    error,
    user
  ) {
    console.log("Username:", req.body.username);
    console.log("Password: ", req.body.password);
    if (error || !user) {
      var err = new Error("Wrong username or password.");
      err.status = 401;
      return next(err);
    } else {
      // sessions=req.session;
      // sessions.username = user._id;
      // req.session.userId = user._id;
      // console.log("ID:", user._id);
      // res.json({"message": "Login successfull with sid = "+req.session.userId});
      // return res.redirect("/");
      return res.redirect("/?id=" + user._id);
    }
  });
};
