const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const ProfileSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  socialNetworkName: {
    type: String,
    required: false,
  },
  socialNetworkUserId: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: true,
    enum: ["restrict", "inactive", "active", "deleted"],
    default: "active",
  },
  accoutType: {
    type: String,
    required: true,
    enum: ["admin", "user", "guest"],
    default: "user",
  },
  passwordResetToken: {
    type: String,
    required: false,
    default: "",
  },
});

// Authenticate input against database
ProfileSchema.statics.authenticate = function (userName, password, callback) {
  Profile.findOne({ userName: userName, state: "active" }).exec(function (
    err,
    user
  ) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.userPassword, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// Hashing a password before saving it to the database
ProfileSchema.pre("save", function (next) {
  var user = this;
  bcrypt.hash(user.userPassword, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.userPassword = hash;
    next();
  });
});

var Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile; // mongoose.model('Profile', ProfileSchema);
