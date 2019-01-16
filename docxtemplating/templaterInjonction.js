const JSZip = require("jszip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

//Load the docx file as a binary
let content = fs.readFileSync(
  path.resolve(__dirname, "matrice_injonction_de_payer.docx"),
  "binary"
);

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

//set the templateVariables
doc.setData({
  ville_pres_TC_Requete: "",
  nationalite_creancier: "",
  denomination_sociale_creancier: "",
  forme_juridique_creancier: "",
  adresse_creancier: "",
  code_postal_creancier: "",
  ville_creancier: "",
  pays_creancier: "",
  capital_social_creancier: "",
  numero_RCS_creancier: "", // "ayant pour numéro unique d’identification {numero_RCS_creancier} RCS "
  ville_RCS_creancier: "",
  numero_Reg_Soc: "", // "enregistrée sous les numéros suivants Reg. Soc. {numero_Reg_soc} Trib.""
  numero_CCIAA: "", // "C.C.I.A.A. {numero_CCIAA}"
  numero_code_fiscal_TVA: "", // "Cod. Fisc. et numéro de TVA {numero_code_fiscal_TVA}"
  madame: "",
  monsieur: "",
  prenom_representant_legal_creancier: "",
  nom_representant_legal_creancier: "",
  fonction_representant_legal_creancier: "",
  nationalite_debiteur: "",
  denomination_sociale_debiteur: "",
  adresse_debiteur: "",
  code_postal_debiteur: "",
  ville_debiteur: "",
  pays_debiteur: "",
  numero_RCS_debiteur: "",
  ville_RCS_debiteur: "",
  prenom_representant_legal_debiteur: "",
  nom_representant_legal_debiteur: "",
  fonction_representant_legal_debiteur: "",
  produits_ou_services: "",
  denomination_sociale_debiteur: "",
  forme_juridique_debiteur: "",
  ht: "",
  ttc: "",
  numero_facture: "",
  date_facture: "",
  montant_facture: "",
  echeance_facture: "",
  calcul_acomptes_payes: "",
  calcul_solde_du: "",
  numero_avoir: "",
  date_avoir: "",
  montant_avoir: "",
  calcul_creance_principale_HT: "",
  calcul_creance_principale_TTC: "",
  delai_paiement_facture: "", // "Les factures devaient être payées à {delai_paiement_facture}"
  paiement_a_la_livraison: "",
  //  "{denomination_sociale_debiteur} devait payer l’intégralité au plus tard à la livraison.
  // Or, pour ne pas la mettre en difficulté, {denomination_sociale_crediteur} lui a fait confiance et lui a "
  totalite_marchandise: "livré la totalité de la marchandise",
  totalite_prestation: "fourni la totalité des prestations",
  date_mise_en_demeure: "",
  entreprise_française:
    "Application du taux de refinancement de la BCE + 10 points",
  entreprise_italienne:
    "Application du taux de refinancement de la BCE + 8 points",
  loi_entreprise_française: "Article L441-6 du code de commerce",
  loi_entreprise_italienne:
    "Décret législatif italien du 9 novembre 2012 n°192",
  frais_accessoire: "",
  honoraires_HT: "",
  honoraires_TTC: "",
  art_700: "Art 700",
  ville_TC_Opposition: "",
  numero_commande: "",
  numero_document_transport: "",
  points_entreprise_française: "de la BCE + 10 points",
  points_entreprise_italienne: "de la BCE + 8 points"
});

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

fs.writeFileSync(
  path.resolve(
    __dirname,
    `${today_file} - Injonction de payer - ${creancier_filename} contre ${debiteur_filename}.docx`
  ),
  buf
);
