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

            doc.setData({
                ville_pres_TC_Requete: result.creancier.ville_siege,
                nationalite_creancier: result.creancier.nationalite_societe,
                denomination_sociale_creancier: result.creancier.denomination_sociale,
                forme_juridique_creancier: result.creancier.forme_juridique,
                adresse_creancier: result.creancier.adresse_siege,
                code_postal_creancier: result.creancier.code_postal_siege,
                ville_creancier: result.creancier.ville_siege,
                pays_creancier: result.creancier.pays_siege,
                capital_social_creancier: result.creancier.capital_social,
                numero_RCS_creancier: result.creancier.num_rcs,
                ville_RCS_creancier: result.creancier.ville_rcs,
                isFrançaise : result.creancier.nationalite_creancier == "France" ? numero_RCS_creancier + ville_RCS_creancier : false,
                numero_Reg_Soc: result.creancier.num_reg_soc,
                numero_CCIAA: result.creancier.num_CCIAA,
                numero_code_fiscal_TVA: result.creancier.num_cod_fisc_tva,
                isItalienne : result.creancier.nationalite_creancier == "Italie" ? numero_Reg_Soc + ville_RCS_creancier + numero_CCIAA + numero_code_fiscal_TVA : false,
                isMale: result.debiteur.civilite == "M." ? true : false,
                isFemale: result.debiteur.civilite == "Mme" ? true : false,
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
                // produits_vendus: result.produits,
                // services_fournis: result.services,
                //   isProduits : result.produits == produits_vendus ? true : false,
                //   isServices : result.services == services_fournis ? true : false,
                denomination_sociale_debiteur: result.debiteur.denomination_sociale,
                forme_juridique_debiteur: result.debiteur.forme_juridique,
                //   montant_facture_ht: result.factures[0].montant_ht,    
                //   montant_facture_ttc: result.factures[0].montant_ttc,
                factures: result.factures.map(facture => {
                    return {
                      numero_facture: facture.num_facture,
                      date_facture: facture.date_facture,
                      montant_facture_ht: facture.montant_ht,
                      montant_facture_ttc: facture.montant_ttc,
                      echeance_facture: facture.echeance_facture,
                      calcul_acomptes_payes: "",
                      calcul_solde_du: "",
                      numero_commande: facture.num_commande,
                      numero_confirmation_commande : facture.num_confirmation_commande,
                      numero_document_transport: facture.num_document_transport,
                    };
                  }),
                  avoirs: result.factures.map(element => {
                    return element.avoirs.map(avoir => {
                      return {
                        numero_avoir: avoir.num_avoir,
                        date_avoir: avoir.date_avoir,
                        montant_avoir_ht: avoir.montant_ht,
                        montant_avoir_ttc: avoir.montant_ttc,
                        echeance_avoir: avoir.echeance_avoir,
                        calcul_acomptes_payes: "",
                        calcul_solde_du: ""
                      };
                    });
                  }),
                  acomptes: result.factures.map(element => {
                    return element.acomptes.map(acompte => {
                      return {
                      numero_acompte: acompte.num_acompte,
                      date_acompte: acompte.date_acompte,
                      acompte_ht: acompte.montant_ht,
                      acompte_ttc: acompte.montant_ttc,
                      calcul_acomptes_payes: "",
                      calcul_solde_du: ""
                      };
                    });
                  }),
                  partiels: result.factures.map(element => {
                    return element.partiels.map(partiel => {
                      return {
                        numero_partiel: partiel.num_partiel,
                        date_partiel: partiel.date_partiel,
                        montant_partiel_ht: partiel.montant_ht,
                        montant_partiel_ttc: partiel.montant_ttc,
                        calcul_acomptes_payes: "",
                        calcul_solde_du: ""
                      };
                    });
                  }),
                calcul_creance_principale_HT: "",
                calcul_creance_principale_TTC: "",
                //   delai_paiement_facture: "Les factures devaient être payées à " + result.factures.echeance_facture,  
                //   paiement_a_la_livraison: result.debiteur.denomination_sociale + "devait payer l’intégralité au plus tard à la livraison. Or, pour ne pas la mettre en difficulté, " + result.creancier.denomination_sociale + " lui a fait confiance et lui a",
                totalite_marchandise: "livré la totalite de la marchandise",
                totalite_prestation: "fourni la totalite des prestations",
            //    isTotaliteMarchandise: result.produits == produits_vendus ? totalite_marchandise : false,
            //    isTotalitePrestation: result.services == services_fournis ? totalite_prestation : false,             
               date_mise_en_demeure: result.date_mise_en_demeure,
               entreprise_française: "Application du taux de refinancement de la BCE + 10 points",
               entreprise_italienne: "Application du taux de refinancement de la BCE + 8 points",
               loi_entreprise_française: "Article L441-6 du code de commerce",
               loi_entreprise_italienne: "Décret législatif italien du 9 novembre 2012 n°192",
               frais_accessoire: result.frais_recouvrement,
               //  honoraires_HT: "",
               //  honoraires_TTC: "",
              //   isHonorairesHT: "",
              //   isHonorairesTTC: "",
              art_700: "Art 700",
              ville_TC_Opposition: result.debiteur.ville_siege,
              points_entreprise_française: "de la BCE + 10 points",
              points_entreprise_italienne: "de la BCE + 8 points",
            //   isEntrepriseFr : result.factures[0].taux_applicable == "10" ? entreprise_française + loi_entreprise_française +  points_entreprise_française: false,
            //   isEntrepriseIt : result.factures[0].taux_applicable == "8" ? entreprise_italienne + loi_entreprise_italienne + points_entreprise_italie: false,
            })

            // debtor's name for the filename
            let debiteur_filename = "";

            // creditor's name  for the filename
            let creancier_filename = "";

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
