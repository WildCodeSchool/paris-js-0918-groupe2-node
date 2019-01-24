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
  createInjonction: (req, res) => {
    models.action
    .findByPk(req.params.id, {
      include: [
        { model: models.creancier },
        { model: models.debiteur },
        {
          model: models.facture,
          where: { active: true },
          include: [
            { model: models.acompte, where: { active: true } },
            { model: models.avoir, where: { active: true } },
            { model: models.partiel, where: { active: true } }
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

      let infosRecap = [];
      for (let i = 0; i < myFinalAlgoResultSorted.length; i++) {
        Object.keys(myFinalAlgoResultSorted[i]).forEach(function(key, index) {
          infosRecap.push(myFinalAlgoResultSorted[i][key]);
        });
      }

      let recap = [];

      for (let i = 0; i < infosRecap.length; i++) {
        for (let j = 0; j < infosRecap[i].length; j++) {
         recap.push(infosRecap[i][j]);   
      }
    }


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

        fsPromises
          .readFile(
            path.resolve(
              __dirname,
              "../docxtemplating/matrice_injonction_de_payer.docx"
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
              ville_pres_TC_Requete: result.creancier.ville_siege.toUpperCase(),
              nationalite_creancier: result.creancier.nationalite_societe,
              denomination_sociale_creancier:
                result.creancier.denomination_sociale,
              forme_juridique_creancier: result.creancier.forme_juridique,
              adresse_creancier: result.creancier.adresse_siege,
              code_postal_creancier: result.creancier.code_postal_siege,
              ville_creancier: result.creancier.ville_siege,
              pays_creancier: result.creancier.pays_siege,
              capital_social_creancier: result.creancier.capital_social,
              numero_RCS_creancier: result.creancier.num_rcs,
              ville_RCS_creancier: result.creancier.ville_rcs,
              isFrançaise: result.creancier.pays_siege == "France" ? true : false,
              numero_Reg_Soc: result.creancier.num_reg_soc,
              numero_CCIAA: result.creancier.num_CCIAA,
              numero_code_fiscal_TVA: result.creancier.num_cod_fisc_tva,
              isItalienne: result.creancier.pays_siege == "Italie" ? true : false,
              isMale: result.creancier.civilite == "M." ? true : false,
              isFemale: result.creancier.civilite == "Mme" ? true : false,
              prenom_representant_legal_creancier: result.creancier.prenom,
              nom_representant_legal_creancier: result.creancier.nom,
              fonction_representant_legal_creancier: result.creancier.fonction,
              nationalite_debiteur: result.debiteur.nationalite_societe,
              denomination_sociale_debiteur: result.debiteur.denomination_sociale,
              adresse_debiteur: result.debiteur.adresse_siege,
              code_postal_debiteur: result.debiteur.code_postal_siege,
              ville_debiteur: result.debiteur.ville_siege,
              pays_debiteur: result.debiteur.pays_siege,
              numero_RCS_debiteur: result.debiteur.num_rcs,
              ville_RCS_debiteur: result.debiteur.ville_rcs,
              prenom_representant_legal_debiteur: result.debiteur.prenom,
              nom_representant_legal_debiteur: result.debiteur.nom,
              fonction_representant_legal_debiteur: result.debiteur.fonction,
              isProduitsServices : result.produits && result.services === true ? true : false,
              isProduits: result.produits === true && result.services == false ? "produits vendus" : false,
              isServices: result.services == true && result.produits == false ? "services fournis" : false,
              denomination_sociale_debiteur: result.debiteur.denomination_sociale,
              forme_juridique_debiteur: result.debiteur.forme_juridique,
              isHT: result.option_ttc_factures === false ? true : false,
              isTTC: result.option_ttc_factures === true ? true : false,
              factures: result.factures.map(facture => {
                return {
                  numero_facture: facture.num_facture,
                  date_facture: facture.date_facture,
                  montant_facture_ht: facture.montant_ht,
                  isFacturesHT:
                  result.option_ttc_factures === false
                    ? true
                    : false,
                  montant_facture_ttc: facture.montant_ttc,
                  isFacturesTTC:
                    result.option_ttc_factures === true
                      ? true
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
                      : false,
                  calcul_solde_du: "",
                  numero_commande: facture.num_commande,
                  numero_confirmation_commande:
                    facture.num_confirmation_commande,
                  numero_document_transport: facture.num_document_transport
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
              date_mise_en_demeure: result.date_mise_en_demeure,
              montant_interets: montantTotalInteretsToutesFactures,
              entreprise_française:
                "Application du taux de refinancement de la BCE + 10 points",
              entreprise_italienne:
                "Application du taux de refinancement de la BCE + 8 points",
              loi_entreprise_française: "Article L441-6 du code de commerce",
              loi_entreprise_italienne:
                "Décret législatif italien du 9 novembre 2012 n°192",
              frais_accessoire: nbreFactures * 40,
              montant_honoraires: result.honoraires,
              isMontantHono: result.honoraires !== 0 ? true : false,
              isHonorairesHT: result.option_ttc_hono === false ? true : false,
              isHonorairesTTC: result.option_ttc_hono === true ? true : false,
              art_700: "Art 700",
              ville_TC_Opposition: result.debiteur.ville_siege,
              points_entreprise_française: "de la BCE + 10 points",
              points_entreprise_italienne: "de la BCE + 8 points",
              isFrançaise : result.taux_interets === 10 ? true : false,
              isItalienne: result.taux_interets === 8 ? true : false,
              isEntrepriseFrançaise : result.taux_interets === 10 ? true : false,
              isEntrepriseItalienne : result.taux_interets === 8 ? true : false,
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
                  `../public/documents/${today_file} - Injonction de payer - ${creancier_filename} contre ${debiteur_filename}.docx`
                ),
                buf
              )
              .then(() =>
                res.send(
                  `${today_file} - Injonction de payer - ${creancier_filename} contre ${debiteur_filename}.docx`
                )
              )
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));

        //res.send(result);
      });
  }
};
