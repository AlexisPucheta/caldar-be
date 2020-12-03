// Declarations
require("dotenv").config();
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Router
const router = require("./routes");

// Database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Cannot connect to the database", err);
  });

// Port
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

// Server listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
