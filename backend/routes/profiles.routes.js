module.exports = (app) => {
  const profile = require("../controllers/profiles.controller.js");

  // Create a new Profile
  app.post("/api/profile", profile.create);

  // Retrieve active Profiles
  app.get("/api/profiles", profile.findActiveProfile);

  // Retrieve all Profiles
  app.get("/api/profile", profile.findAll);

  // Retrieve a single Profile with ProfileId
  app.get("/api/profile/:userid", profile.findOne);

  // Update a Profile with ProfileId
  app.put("/api/profile/:username", profile.update);

  // Delete a Profile with ProfileId
  app.delete("/api/profile/:username", profile.delete);

  //POST for login
  app.post("/api/login", profile.login);

  // GET for logout logout
  app.get("/api/logout", function (req, res, next) {
    if (req.session) {
      // Delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          res.json({ message: "Logout successfull" });
          // return res.redirect('/');
        }
      });
    }
  });
};
