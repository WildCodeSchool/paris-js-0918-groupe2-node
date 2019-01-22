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
  createMed: (req, res) => {
    models.action
      .findByPk(req.params.id, {
        include: [
          { model: models.creancier },
          { model: models.debiteur },
          {
            model: models.facture,
            include: [
              { model: models.acompte },
              { model: models.avoir },
              { model: models.partiel }
            ]
          }
        ]
      })
      .then(async result => {
        let myFinalAlgoResult = [];

        if (result.option_ttc_factures === true) {
          for (let i = 0; i < result.factures.length; i++) {
            let facture = {
              montant_ttc: result.factures[i].montant_ttc,
              echeance_facture: result.factures[i].echeance_facture
            };

            let mesAcomptes = [];

            for (let j = 0; j < result.factures[i].acomptes.length; j++) {
              mesAcomptes.push({
                montant_ttc: result.factures[i].acomptes[j].montant_ttc
              });
            }

            let mesAvoirs = [];

            for (let k = 0; k < result.factures[i].avoirs.length; k++) {
              mesAvoirs.push({
                montant_ttc: result.factures[i].avoirs[k].montant_ttc
              });
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
          }
        } else {
          for (let i = 0; i < result.factures.length; i++) {
            let facture = {
              montant_ttc: result.factures[i].montant_ht,
              echeance_facture: result.factures[i].echeance_facture
            };

            let mesAcomptes = [];

            for (let j = 0; j < result.factures[i].acomptes.length; j++) {
              mesAcomptes.push({
                montant_ttc: result.factures[i].acomptes[j].montant_ht
              });
            }

            let mesAvoirs = [];

            for (let k = 0; k < result.factures[i].avoirs.length; k++) {
              mesAvoirs.push({
                montant_ttc: result.factures[i].avoirs[k].montant_ht
              });
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
        let myFinalAlgoResultSorted = [];

        // myFinalAlgoResultSorted retourne un objet de ce style
        //   [ { facture_0:
        //     [ [Object],
        //       [Object],
        //       [Object] ] },
        //  { facture_1:
        //     [ [Object], [Object], [Object] ] } ]
        // chaque objet est composé de la sorte:
        // { date_debut: '01/07/2018',
        // date_fin: '20/12/2018',
        // creance_sur_cette_periode: 7300,
        // nbre_jours_comptabilises: 173,
        // interets_periode: 346,
        // taux_interet_applique: 0 }

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
              return -mySorted;
            }
          );

          myFinalAlgoResultSorted.push({ [numberFacture + i]: mySortedResult });
        }
        // console.log(myFinalAlgoResultSorted);

        //Load the docx file as a binary
        fsPromises
          .readFile(
            path.resolve(
              __dirname,
              "../docxtemplating/matrice_mise_en_demeure.docx"
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

            let lesAvoirs = [];

            for (let i = 0; i < result.factures.length; i++) {
              for (let j = 0; j < result.factures[i].avoirs.length; j++) {
                lesAvoirs.push(result.factures[i].avoirs[j]);
              }
            }

            let lesAcomptes = [];
            for (let i = 0; i < result.factures.length; i++) {
              for (let j = 0; j < result.factures[i].acomptes.length; j++) {
                lesAcomptes.push(result.factures[i].acomptes[j]);
              }
            }

            let lesPartiels = [];
            for (let i = 0; i < result.factures.length; i++) {
              for (let j = 0; j < result.factures[i].partiels.length; j++) {
                lesPartiels.push(result.factures[i].partiels[j]);
              }
            }

            doc.setData({
              denomination_sociale_debiteur:
                result.debiteur.denomination_sociale,
              forme_juridique_debiteur: result.debiteur.forme_juridique,
              isMale: result.debiteur.civilite == "M." ? true : false,
              isFemale: result.debiteur.civilite == "Mme" ? true : false,
              // isM: result.debiteur.civilite == "M." ? true : false,
              // isF: result.debiteur.civilite == "Mme" ? true : false,
              prenom_representant_legal: result.debiteur.prenom,
              nom_representant_legal: result.debiteur.nom,
              fonction_representant_legal: result.debiteur.fonction,
              adresse_debiteur: result.debiteur.adresse_siege,
              code_postal_debiteur: result.debiteur.code_postal_siege,
              ville_debiteur: result.debiteur.ville_siege,
              date_mise_en_demeure: today,
              denomination_sociale_creancier:
                result.creancier.denomination_sociale,
              nationalite_creancier: result.creancier.nationalite_societe,
              forme_juridique_creancier: result.creancier.forme_juridique,
              adresse_creancier: result.creancier.adresse_siege,
              code_postal_creancier: result.creancier.code_postal_siege,
              ville_creancier: result.creancier.ville_siege,
              pays_creancier: result.creancier.pays_siege,
              isHT: result.option_ttc_factures === false ? true : false,
              isTTC: result.option_ttc_factures === true ? true : false,
              factures: result.factures.map(facture => {
                return {
                  numero_facture: facture.num_facture,
                  date_facture: facture.date_facture,
                  montant_facture_ht: facture.montant_ht,
                  isFacturestHT:
                    result.option_ttc_factures == false
                      ? facture.montant_ht
                      : false,
                  montant_facture_ttc: facture.montant_ttc,
                  isFacturesTTC:
                    result.option_ttc_factures == true
                      ? facture.montant_ttc
                      : false,
                  echeance_facture: facture.echeance_facture,
                  calcul_acomptes_payes: "",
                  isPaiementEcheance:
                    facture.paiement_echeance == true
                      ? "les factures devaient être payées à"
                      : false,
                  isPaiementLivraison:
                    facture.paiement_livraison == true
                      ? result.debiteur.denomination_sociale +
                        "devait payer l’intégralité au plus tard à la livraison. Or, pour ne pas la mettre en difficulté," +
                        result.creancier.denomination_sociale +
                        "lui a fait confiance et lui a "
                      : false
                };
              }),
              avoirs: lesAvoirs.map(avoir => {
                return {
                  numero_avoir: avoir.num_avoir,
                  date_avoir: avoir.date_avoir,
                  montant_avoir_ht: avoir.montant_ht,
                  isAvoirsHT:
                    result.option_ttc_factures === false ? true : false,
                  montant_avoir_ttc: avoir.montant_ttc,
                  isAvoirsTTC:
                    result.option_ttc_factures === true ? true : false
                };
              }),
              acomptes: lesAcomptes.map(acompte => {
                  return {
                    numero_acompte: acompte.num_acompte,
                    date_acompte: acompte.date_acompte,
                    montant_acompte_ht: acompte.montant_ht,
                    isAcomptesHT:
                      result.option_ttc_factures == false
                        ? acompte.montant_ht
                        : false,
                    montant_acompte_ttc: acompte.montant_ttc,
                    isAcomptesTTC:
                      result.option_ttc_factures == true
                        ? acompte.montant_ttc
                        : false
                  };
              }),
              partiels: lesPartiels.map(partiel => {
                  return {
                    numero_partiel: partiel.num_partiel,
                    date_partiel: partiel.date_partiel,
                    montant_partiel_ht: partiel.montant_ht,
                    isPartielsHT:
                      result.option_ttc_factures == false
                        ? partiel.montant_ht
                        : false,
                    montant_partiel_ttc: partiel.montant_ttc,
                    isPartielsTTC:
                      result.option_ttc_factures == true
                        ? partiel.montant_ttc
                        : false
                  };
              }),
              calcul_creance_principale_HT: result.calcul_solde_du,
              calcul_creance_principale_TTC: result.calcul_total_creance,
              isCreanceHT: result.option_ttc_factures === false ? true : false,
              isCreanceTTC: result.option_ttc_factures === true ? true : false,
              isProduitsServices:
                result.produits && result.services === true ? true : false,
              isProduits:
                result.produits === true && result.services == false
                  ? "produits vendus"
                  : false,
              isServices:
                result.services == true && result.produits == false
                  ? "services fournis"
                  : false,
              entreprise_française:
                "En application de l’article L. 441-6 du Code de commerce, les factures impayées font courir des intérêts légaux au taux de refinancement de la BCE majoré de 10 points, à compter de leur date d’échéance sans qu’un rappel soit nécessaire, outre le paiement d’une indemnité forfaitaire pour frais de recouvrement de quarante euros par facture impayée et le remboursement de tous autres frais complémentaires de recouvrement.",
              entreprise_italienne:
                "En application du décret législatif italien du 9 novembre 2012 n°192 y compris ses modifications ultérieures, les factures impayées font courir des intérêts légaux au taux de refinancement de la BCE majoré de 8 points, à compter de leur date d’échéance sans qu’un rappel soit nécessaire, outre le paiement d’une indemnité forfaitaire pour frais de recouvrement de quarante euros par facture impayée et le remboursement de tous autres frais complémentaires de recouvrement.",
              isEntrepriseFrançaise: result.taux_interets === 10 ? true : false,
              isEntrepriseItalienne: result.taux_interets === 8 ? true : false,
              calcul_total_interets: "",
              montant_honoraires: result.honoraires,
              isMontantHono: result.honoraires !== 0 ? true : false,
              isHonorairesHT: result.option_ttc_hono === false ? true : false,
              isHonorairesTTC: result.option_ttc_hono === true ? true : false
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
              console.log(JSON.stringify({ error: error }));
              throw error;
            }

            const buf = doc.getZip().generate({ type: "nodebuffer" });

            fsPromises
              .writeFile(
                path.resolve(
                  __dirname,
                  `../public/documents/${today_file} - Mise en demeure - ${creancier_filename} contre ${debiteur_filename}.docx`
                ),
                buf
              )
              .then(() =>
                res.send(
                  `${today_file} - Mise en demeure - ${creancier_filename} contre ${debiteur_filename}.docx`
                )
              )
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));

        //res.send(result);
      });
  }
};
