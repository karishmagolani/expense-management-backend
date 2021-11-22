const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const bodyParser = require("body-parser");
require("dotenv").config();

// fVGU5A0to4npvQn4

const dbURI = process.env.DB_URI;

const app = express();
const PORT = 8080;

// Connectong DB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function (result) {
    console.log("Database is connected");
  })
  .catch((err) => console.log(err));

// Apply CORS policy
app.use(cors());

// Assign the PORT to our app
app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// User Routes
app.use("/user", userRoutes);
