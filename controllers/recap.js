const models = require("../models");
const JSZip = require("jszip");
const Docxtemplater = require("docxtemplater");
const algo = require("../dojoalgo").maSuperMetaFonction;
const moment = require("moment");
moment().format();

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
            where: { active: true },
            include: [
              {
                model: models.acompte,
                where: { active: true },
                required: false
              },
              { model: models.avoir, where: { active: true }, required: false },
              {
                model: models.partiel,
                where: { active: true },
                required: false
              }
            ]
          }
        ]
      })
      .then(async result => {
        let myFinalAlgoResult = [];
        let myFinalAlgoResultSorted = [];
        let myFinalAlgoResultSortedNoNumber = [];
        let nbreFactures = result.factures.length;
        let creanceTotaleSansPartielsTTC = [];
        let creanceTotaleSansPartielsHT = [];
        if (result.option_ttc_factures === true) {
          for (let i = 0; i < result.factures.length; i++) {
            let facture = {
              montant_ttc: result.factures[i].montant_ttc,
              echeance_facture: result.factures[i].echeance_facture
            };

            creanceTotaleSansPartielsTTC.push(result.factures[i].montant_ttc);

            let mesAcomptes = [];

            for (let j = 0; j < result.factures[i].acomptes.length; j++) {
              mesAcomptes.push({
                montant_ttc: result.factures[i].acomptes[j].montant_ttc
              });
              creanceTotaleSansPartielsTTC[i] -=
                result.factures[i].acomptes[j].montant_ttc;
            }

            let mesAvoirs = [];

            for (let k = 0; k < result.factures[i].avoirs.length; k++) {
              mesAvoirs.push({
                montant_ttc: result.factures[i].avoirs[k].montant_ttc
              });
              creanceTotaleSansPartielsTTC[i] -=
                result.factures[i].avoirs[k].montant_ttc;
            }

            let mesPaiementsPartiels = [];

            for (let l = 0; l < result.factures[i].partiels.length; l++) {
              mesPaiementsPartiels.push({
                montant_ttc: result.factures[i].partiels[l].montant_ttc,
                date_partiel: result.factures[i].partiels[l].date_partiel
              });
            }

            let dateFinCalculInterets = result.date;
            let points = result.taux_interets;
            let facture_number = "facture";

            myFinalAlgoResult.push({
              [facture_number]: await algo(
                facture,
                mesAcomptes,
                mesAvoirs,
                mesPaiementsPartiels,
                dateFinCalculInterets,
                points
              )
            });
            // console.log(creanceTotaleSansPartielsTTC);
          }
        } else {
          for (let i = 0; i < result.factures.length; i++) {
            let facture = {
              montant_ttc: result.factures[i].montant_ht,
              echeance_facture: result.factures[i].echeance_facture
            };

            creanceTotaleSansPartielsHT.push(result.factures[i].montant_ht);

            let mesAcomptes = [];

            for (let j = 0; j < result.factures[i].acomptes.length; j++) {
              mesAcomptes.push({
                montant_ttc: result.factures[i].acomptes[j].montant_ht
              });
              creanceTotaleSansPartielsHT[i] -=
                result.factures[i].acomptes[j].montant_ht;
            }

            let mesAvoirs = [];

            for (let k = 0; k < result.factures[i].avoirs.length; k++) {
              mesAvoirs.push({
                montant_ttc: result.factures[i].avoirs[k].montant_ht
              });
              creanceTotaleSansPartielsHT[i] -=
                result.factures[i].avoirs[k].montant_ht;
            }

            let mesPaiementsPartiels = [];

            for (let l = 0; l < result.factures[i].partiels.length; l++) {
              mesPaiementsPartiels.push({
                montant_ttc: result.factures[i].partiels[l].montant_ht,
                date_partiel: result.factures[i].partiels[l].date_partiel
              });
            }

            let dateFinCalculInterets = result.date;
            let points = result.taux_interets;
            let facture_number = "facture";

            myFinalAlgoResult.push({
              [facture_number]: await algo(
                facture,
                mesAcomptes,
                mesAvoirs,
                mesPaiementsPartiels,
                dateFinCalculInterets,
                points
              )
            });
          }
        }

        // console.log(JSON.stringify(myFinalAlgoResult, null, 2));

        // myFinalAlgoResultSorted retourne un objet de ce style
        //   [ { facture_0:
        //     [ [Object],
        //       [Object],
        //       [Object] ] },
        //  { facture_1:
        //     [ [Object], [Object], [Object] ] } ]
        // chaque objet est composé de la sorte:
        // facture_0: [{ date_debut: '01/07/2018',
        // date_fin: '20/12/2018',
        // creance_sur_cette_periode: 7300,
        // nbre_jours_comptabilises: 173,
        // interets_periode: 346,
        // taux_interet_applique: 0 }]

        for (let i = 0; i < myFinalAlgoResult.length; i++) {
          let numberFacture = "facture_";

          let mySortedResult = myFinalAlgoResult[i].facture.sort(
            (item, otherItem) => {
              dateDebutPremierItem = moment(
                item.date_debut,
                "DD/MM/YYYY",
                true
              );
              dateDebutSecondItem = moment(
                otherItem.date_debut,
                "DD/MM/YYYY",
                true
              );
              let mySorted = dateDebutPremierItem.diff(dateDebutSecondItem);
              return +mySorted;
            }
          );

          myFinalAlgoResultSorted.push({ [numberFacture + i]: mySortedResult });
          myFinalAlgoResultSortedNoNumber.push({ facture: mySortedResult });
        }

        //   let infosRecap = [];
        //   for (let i = 0; i < myFinalAlgoResultSorted.length; i++) {
        //     Object.keys(myFinalAlgoResultSorted[i]).forEach(function(key, index) {
        //       infosRecap.push(myFinalAlgoResultSorted[i][key]);
        //     });
        //   }

        //   let recap = [];

        //   for (let i = 0; i < infosRecap.length; i++) {
        //     for (let j = 0; j < infosRecap[i].length; j++) {
        //      recap.push(infosRecap[i][j]);
        //   }
        // }
        // console.log(infosRecap)

        ////////////////////////////////////////////////////
        // CETTE SECTION SERT A CALCULER LE MONTANT TOTAL //
        // DES INTERETS POUR TTES LES FACTURES            //
        ////////////////////////////////////////////////////

        let montantTotalInterets = 0;

        for (let i = 0; i < myFinalAlgoResultSortedNoNumber.length; i++) {
          for (
            let j = 0;
            j < myFinalAlgoResultSortedNoNumber[i].facture.length;
            j++
          ) {
            montantTotalInterets +=
              myFinalAlgoResultSortedNoNumber[i].facture[j].interets_periode;
          }
        }

        let montantTotalInteretsToutesFactures = parseFloat(
          montantTotalInterets.toFixed(2)
        );

        ////////////////////////////////////////////////////
        //               FIN DE SECTION                   //
        //                                                //
        ////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        // CETTE SECTION EXPLIQUE COMMENT EST CALCULE LE MONTANT TOTAL //
        // DE LA CREANCE MOINS LES ACOMPTES ET AVOIRS                  //
        // DEJA PAYES (MAIS SANS LES PAIEMENTS PARTIELS)               //
        ////////////////////////////////////////////////////////////////

        // console.log(creanceTotaleSansPartielsTTC, creanceTotaleSansPartielsHT);

        // creanceTotaleSansPartielsTTC sera rempli comme un tableau d'entiers
        // uniquement si option_ttc_factures est réglé sur true dans l'action

        // creanceTotaleSansPartielsHT sera rempli comme un tableau d'entiers
        // uniquement si option_ttc_factures est réglé sur false dans l'action

        // si le tableau TTC est rempli, celui en HT sera vide et vice versa.

        ////////////////////////////////////////////////////
        //               FIN DE SECTION                   //
        //                                                //
        ////////////////////////////////////////////////////

        // let tabTTC = [];

        // for (let i = 0; i < creanceTotaleSansPartielsTTC.length; i++) {
        //   tabTTC.push([creanceTotaleSansPartielsTTC[i]]);
        // }

        // let tabHT = [];
        // for (let i = 0; i < creanceTotaleSansPartielsHT.length; i++) {
        //   tabHT.push([creanceTotaleSansPartielsHT[i]]);
        // }

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

            //set today's date
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1; // january is 0...
            let yyyy = today.getFullYear();

            if (dd < 10) {
              dd = "0" + dd;
            }
            if (mm < 10) {
              mm = "0" + mm;
            }

            today = dd + "/" + mm + "/" + yyyy; // date for the word document
            today_file = dd + "-" + mm + "-" + yyyy; // date for the file name
            // console.log(myFinalAlgoResultSorted)

            doc.setData({
              denomination_sociale_creancier:
                result.creancier.denomination_sociale,
              denomination_sociale_debiteur:
                result.debiteur.denomination_sociale,
              factures: result.factures.map((facture, index) => {
                return {
                  numero_facture: facture.num_facture,
                  date_facture: facture.date_facture,
                  echeance_facture: facture.echeance_facture,
                  montant_facture_HT: facture.montant_ht,
                  isFacturesHT:
                    result.option_ttc_factures === false ? true : false,
                  montant_facture_TTC: facture.montant_ttc,
                  isFacturesTTC:
                    result.option_ttc_factures === true ? true : false,
                  montant_creance:
                    myFinalAlgoResultSorted[index][`facture_${index}`][0]
                      .creance_sur_cette_periode,
                  infoRecap: myFinalAlgoResultSorted[index][
                    `facture_${index}`
                  ].map(newRecap => {
                    return {
                      date_debut: newRecap.date_debut,
                      date_fin: newRecap.date_fin,
                      nombre_jours_interets: newRecap.nbre_jours_comptabilises,
                      tauxFr: newRecap.taux_interet_applique + 10,
                      tauxIt: newRecap.taux_interet_applique + 8,
                      isTauxFr: result.taux_interets === 10 ? true : false,
                      isTauxIt: result.taux_interets === 8 ? true : false,
                      montant_interets: newRecap.interets_periode.toFixed(2),
                      montant_creance: newRecap.creance_sur_cette_periode
                    };
                  })
                };
              }),
              taux_BCE: "",
              points_entreprise_française: "de 10 points",
              points_entreprise_italienne: "de 8 points",

              // tableauTTC: tabTTC.map(newTabTTC => {
              //   return {
              //     montant_ttc: newTabTTC,
              //     isTTC: result.option_ttc_factures === true ? true : false
              //   };
              // })[0],
              // tableauHT: tabHT.map(newTabHT => {
              //   return {
              //     montant_ht: newTabHT,
              //     isHT: result.option_ttc_factures === false ? true : false
              //   };
              // })[0],
              date_reglement_acompte: "",
              montant_acompte: "",
              montant_total_interets: montantTotalInteretsToutesFactures,
              loi_entreprise_française:
                "Art. L 441-6 du Code de commerce : Sauf disposition contraire qui ne peut toutefois fixer un taux inférieur à trois fois le taux d'intérêt légal, ce taux est égal au taux d'intérêt appliqué par la BCE majoré de 10 points de pourcentage (...) Les pénalités de retard sont exigibles sans qu'un rappel soit nécessaire. / Décret n° 2012-1115 du 2 octobre 2012 A compter du 1er janvier 2013, tout professionnel en situation de retard de paiement devient de plein droit débiteur, à l'égard de son créancier, (...) d'une indemnité forfaitaire pour frais de recouvrement de 40 euros.",
              isEntrepriseFrançaise: result.taux_interets === 10 ? true : false,
              isEntrepriseItalienne: result.taux_interets === 8 ? true : false
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
                  `../public/documents/${today_file} - Tableau de calcul des intérêts - ${creancier_filename} contre ${debiteur_filename}.docx`
                ),
                buf
              )
              .then(() =>
                res.send(
                  `${today_file} - Tableau calcul intérêts - ${creancier_filename} contre ${debiteur_filename}.docx`
                )
              )
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));

        //res.send(result);
      });
  }
};
