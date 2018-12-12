require("dotenv").config();
const express = require("express");
const logger = require("morgan"); // prints all RESTful requests to the console
const bodyParser = require("body-parser");
const models = require("./models");
const cors = require("cors");
const Joi = require("joi"); // validation module

const cabinetControllers = require("./controllers").cabinets;

// Set up the express app
const app = express();

// Log requests to the console if the app is in Dev environment
if (app.get("env") === "development") {
  app.use(logger("tiny"));
  console.log("Dev environment: Morgan is running");
}

app.use(cors());

// Parses the body of any request catched
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CRUD routes for the Cabinet
app.post("/api/cabinet", cabinetControllers.create);
app.get("/api/cabinet", cabinetControllers.list);
app.put("/api/cabinet/:cabinetId", cabinetControllers.update);
app.delete("/api/cabinet/:cabinetId", cabinetControllers.destroy);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);
models.sequelize.sync().then(() => app.listen(4848));

module.exports = app;
