const models = require("../models");
const JSZip = require("jszip");
const Docxtemplater = require("docxtemplater");

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
            include: [
              { model: models.acompte },
              { model: models.avoir },
              { model: models.partiel }
            ]
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
              ville_pres_TC_Requete: result.creancier.ville_siege,
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
              entreprise_française:
                "Application du taux de refinancement de la BCE + 10 points",
              entreprise_italienne:
                "Application du taux de refinancement de la BCE + 8 points",
              loi_entreprise_française: "Article L441-6 du code de commerce",
              loi_entreprise_italienne:
                "Décret législatif italien du 9 novembre 2012 n°192",
              frais_accessoire: result.frais_recouvrement,
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
