const models = require("../models");
const JSZip = require("jszip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const fsPromises = fs.promises;

const path = require("path");

module.exports = {
  createRecap: (req, res) => {
    models.action
      .findByPk(req.params.id, {
        include: [
          { model: models.creancier },
          { model: models.debiteur },
          {
            model: models.facture,
            include: [{ model: models.acompte }, { model: models.avoir }]
          }
        ]
      })
      .then(result => {
        // Algo de calcul + concat de result
        // then => Generation de document

        //Load the docx file as a binary
        fsPromises
          .readFile(
            path.resolve(
              __dirname,
              "../docxtemplating/matrice_tableau_recapitulatif.docx"
            ),
            "binary"
          )
          .then(content => {
            const zip = new JSZip(content);

            const doc = new Docxtemplater();
            doc.loadZip(zip);

            doc.setData({
              denomination_sociale_creancier: result.creancier.denomination_sociale,
              denomination_sociale_debiteur: result.debiteur.denomination_sociale,
              factures: result.factures.map(facture => {
                return {
                  numero_facture: facture.num_facture,
                  date_facture: facture.date_facture,
                }}),
              // numero_facture: result.factures.num_facture,
              // date_facture: result.factures.date_facture,
              calcul_creance_principale_HT: "",
              calcul_creance_principale_TTC: "",
              taux_BCE: "",
              points_entreprise_française: "taux BCE + 10 points",
              points_entreprise_italienne: "taux BCE + 8 points",
              date_debut: "",
              date_fin: "",
              nombre_jours_interets: "",
              taux: "",
              montant_interets: "",
              date_reglement_acompte: "",
              montant_acompte: "",
              montant_total_interets: "",
              loi_entreprise_française:
                "Art. L 441-6 du Code de commerce : Sauf disposition contraire qui ne peut toutefois fixer un taux inférieur à trois fois le tauxd'intérêt légal, ce taux est égal au taux d'intérêt appliqué par la BCE majoré de 10 points de pourcentage (...) Les pénalités de retard  sont  exigibles  sans  qu'un  rappel  soit  nécessaire.  /  Décret  n°  2012-1115 du  2  octobre  2012  A  compter  du  1er  janvier 2013, tout professionnel en situation de retard de paiement devient de plein droit débiteur, à l'égard de son créancier, (...) d'une indemnité forfaitaire pour frais de recouvrement de 40 euros."
              //   isEntrepriseFr : "",
            });

            // debtor's name for the filename
            let debiteur_filename = result.debiteur.denomination_sociale;

            // creditor's name  for the filename
            let creancier_filename = result.creancier.denomination_sociale;

            try {
              // render the document
              doc.render();
            } catch (error) {
              const e = {
                message: error.mesage,
                name: error.name,
                stack: error.stack,
                properties: error.properties
              };
              console.log(JSON.stringify({ error: e }));
              throw error;
            }

            const buf = doc.getZip().generate({ type: "nodebuffer" });

            fsPromises
              .writeFile(
                path.resolve(
                  __dirname,
                  `../public/documents/Tableau calcul intérêts - ${creancier_filename} contre ${debiteur_filename}.docx`
                ),
                buf
              )
              .then(() =>
                res.send(
                  `Tableau calcul intérêts - ${creancier_filename} contre ${debiteur_filename}.docx`
                )
              )
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));

        //res.send(result);
      });
  }
};
