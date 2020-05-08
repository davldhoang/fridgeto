const express = require("express");
const bodyParser = require("body-parser");

const multer = require("multer");
const cors = require("cors");

// create express app
const app = express();
const PORT = process.env.PORT || 3000; // Step 1

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb("Only .png, .jpg and .jpeg format allowed!", false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + "-" + file.originalname);
    console.log(req.body.filename + "---" + file.filename);
    cb(null, file.originalname);
  },
});

// const upload = multer({ storage: storage }).array("file");
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array("file");

app.post("/api/upload", function (req, res) {
  upload(req, res, function (err) {
    console.log(req.body.filename);
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(process.env.MONGODB_URI || dbConfig.url, {
    // Step 2
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// Define a simple route to root
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Fridgeto application!" });
});

require("./routes/profiles.routes.js")(app);
require("./routes/recipes.routes.js")(app);
require("./routes/comments.routes.js")(app);

// Step 3
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/build"));
}

app.listen(PORT, console.log(`Server is starting at ${PORT}`));

var session = require("express-session");
app.use(session({ secret: "my-secret" }));

var sessions = null;
