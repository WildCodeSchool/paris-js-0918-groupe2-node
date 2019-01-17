require("dotenv").config();
const express = require("express");
const logger = require("morgan"); // prints all RESTful requests to the console
const bodyParser = require("body-parser");
const cors = require("cors");
const Joi = require("joi"); // validation module
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "tmp/" });
const path = require("path");
const models = require("./models");
// const algo = require('./algotest')
// const router = express.Router();

// Gets all the controllers to be used
const cabinetControllers = require("./controllers").cabinets;
const creanciersController = require("./controllers").creanciers;
const debiteursController = require("./controllers").debiteurs;
const facturesController = require("./controllers").factures;
const avoirsController = require("./controllers").avoirs;
const acomptesController = require("./controllers").acomptes;
const actionsController = require("./controllers").actions;
const documentsController = require("./controllers").documents;

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
app.use(express.static(path.join(__dirname, "public")));

// app.get('/aled', (req, res) => {
//   algo.getCalculInteretsTotal().then(result => {
//       res.json(result)
//   })
// })

// CRUD routes for the Cabinet
app.post("/api/cabinet", cabinetControllers.create);
app.get("/api/cabinet", cabinetControllers.list);
app.put("/api/cabinet/:cabinetId", cabinetControllers.update);
app.delete("/api/cabinet/:cabinetId", cabinetControllers.destroy);
// app.post(
//   "/dashboard/moncompte",
//   upload.array("signature", 2),
//   (req, res, next) => {
//     console.log(req.files);
//     for (f of req.files)
//       fs.rename(f.path, "public/images/" + f.originalname, function(err) {
//         if (err) {
//           res.send("problème durant le déplacement");
//         } else {
//           res.send("Fichier uploadé avec succès");
//         }
//       });
//   }
// );

// CRUD routes for the Creanciers
app.post("/api/creanciers", creanciersController.create);
app.get("/api/creanciers", creanciersController.list);
app.put("/api/creanciers/:creancierId", creanciersController.update);
app.delete("/api/creanciers/:creancierId", creanciersController.destroy);

// CRUD routes for the Debiteurs
app.get("/api/debiteurs", debiteursController.list);
app.post("/api/debiteurs", debiteursController.create);
app.put("/api/debiteurs/:debiteurId", debiteursController.update);
app.delete("/api/debiteurs/:debiteurId", debiteursController.destroy);

// CRUD routes for the Factures
app.get("/api/factures/:factureId", facturesController.get);
app.get("/api/factures", facturesController.list);
app.post("/api/factures", facturesController.create);
app.put("/api/factures/:factureId", facturesController.update);
app.delete("/api/factures/:factureId", facturesController.destroy);

// CRUD routes for the Avoirs
app.get("/api/avoirs", avoirsController.list);
app.post("/api/avoirs", avoirsController.create);
app.put("/api/avoirs/:avoirId", avoirsController.update);
app.delete("/api/avoirs/:avoirId", avoirsController.destroy);

// CRUD routes for the Acomptes
app.get("/api/acomptes", acomptesController.list);
app.post("/api/acomptes", acomptesController.create);
app.put("/api/acomptes/:acompteId", acomptesController.update);
app.delete("/api/acomptes/:acompteId", acomptesController.destroy);

// CRUD routes for the Actions
app.get("/api/actions/:actionId/", actionsController.get);
app.get("/api/actions", actionsController.list);
app.post("/api/actions", actionsController.create);
app.put("/api/actions/:actionId", actionsController.update);
app.delete("/api/actions/:actionId", actionsController.destroy);


// Documents creation 
app.get("/api/documents/createFormalNotice/:id/", documentsController.createFormalNotice);

// Setup of a default catch-all route that sends back a message in JSON format.
app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);
models.sequelize.sync().then(() => app.listen(4848));

module.exports = app;
