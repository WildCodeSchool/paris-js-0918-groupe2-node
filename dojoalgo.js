const moment = require("moment");
const fetch = require("node-fetch");
const axios = require("axios");
const http = require("http");
moment().format();

const facture = {
  montant_ttc: 10268,
  echeance_facture: "01/01/2016"
};

const mesAcomptes = [
  (acompte1 = {
    montant_ttc: 100
  }),
  (acompte2 = {
    montant_ttc: 100
  })
];

const mesAvoirs = [
  (avoir1 = {
    montant_ttc: 30
  }),
  (avoir2 = {
    montant_ttc: 38
  })
];

const dateFinCalculInterets = "30/06/2016";

const getTotalCreance = (facture, acomptes, avoirs) => {
  let montantFacture = facture.montant_ttc;
  let montantAvoir = 0;
  for (i = 0; i < avoirs.length; i++) {
    montantAvoir += avoirs[i].montant_ttc;
  }
  let montantAcompte = 0;
  for (i = 0; i < acomptes.length; i++) {
    montantAcompte += acomptes[i].montant_ttc;
  }
  let totalCreance = montantFacture - montantAvoir - montantAcompte;
  return totalCreance;
};

const totalCreance = getTotalCreance(facture, mesAcomptes, mesAvoirs);

const getDateRangesWithInterestRates = (startDate, endDate) => {
  let depart_echeance = moment(startDate, "DD/MM/YYYY", true);
  let fin_echeance = moment(endDate, "DD/MM/YYYY", true);

  let nbreAnneesDifferences = fin_echeance.diff(depart_echeance, "year");
  let nbreJoursInterets = fin_echeance.diff(depart_echeance, "days") + 1;

  let regexAnnee = /(\d){4}/g;
  let anneeDepart = parseInt(startDate.match(regexAnnee));
  let anneeFin = parseInt(endDate.match(regexAnnee));
  let mesAnnees = [anneeFin];
  for (i = 1; i < nbreAnneesDifferences + 1; i++) {
    mesAnnees.push(anneeFin - i);
  }

  let AnneesAvecJoursParSemestres = [];

  for (i = 0; i < mesAnnees.length; i++) {
    let semestreUnDepart = moment(`01/01/${mesAnnees[i]}`, "DD/MM/YYYY", true);
    let semestreUnFin = moment(`30/06/${mesAnnees[i]}`, "DD/MM/YYYY", true);
    let semestreDeuxDepart = moment(
      `01/07/${mesAnnees[i]}`,
      "DD/MM/YYYY",
      true
    );
    let semestreDeuxFin = moment(`31/12/${mesAnnees[i]}`, "DD/MM/YYYY", true);
    let nbreJoursSemestreUn = semestreUnFin.diff(semestreUnDepart, "days") + 1;
    let nbreJoursSemestreDeux =
      semestreDeuxFin.diff(semestreDeuxDepart, "days") + 1;
    let nbreJoursAnnee = nbreJoursSemestreUn + nbreJoursSemestreDeux;

    AnneesAvecJoursParSemestres.push({
      annee: mesAnnees[i],
      joursSemestre1: nbreJoursSemestreUn,
      joursSemestre2: nbreJoursSemestreDeux,
      nbreJourAnnee: nbreJoursAnnee
    });
  }
  AnneesAvecJoursParSemestres.push({ nbreJoursInterets: nbreJoursInterets });
  //   console.log(AnneesAvecJoursParSemestres);
  return AnneesAvecJoursParSemestres;
};

const nbreJoursInterets = getDateRangesWithInterestRates(
  facture.echeance_facture,
  dateFinCalculInterets
);

const getBCErates = (startDate, endDate) => {
  return axios
    .get(
      `https://sdw-wsrest.ecb.europa.eu/service/data/FM/D.U2.EUR.4F.KR.MRR_FR.LEV?startPeriod=${startDate}&endPeriod=${endDate}`,
      { headers: { Accept: "application/json" } }
    )
    .then(
      res => res.data.dataSets[0].series["0:0:0:0:0:0:0"].observations[0][0]
    );
};

const AlgoDeOuf = async (
  totalCreance,
  nbreJoursInterets,
  totalJoursAnnee,
  annee,
  points
) => {
  const BCErate = await getBCErates(`${annee}-01-01`, `${annee}-01-01`).then(
    res => {
      let jourSurAnnee = nbreJoursInterets / totalJoursAnnee;
      let rateEtPoint = (res + points) / 100;
      console.log(totalCreance * jourSurAnnee * rateEtPoint);
      console.log(nbreJoursInterets);
    }
  );

  //   console.log(BCErate);
  // boucle for qui itere sur chaque semestre a reculon?
};

AlgoDeOuf(
  totalCreance,
  nbreJoursInterets[1].nbreJoursInterets,
  nbreJoursInterets[0].nbreJourAnnee,
  nbreJoursInterets[0].annee,
  10
);

// let totalFacture = getTotalCreance(facture, mesAcomptes, mesAvoirs);

// < 1 semestre
// totalFacture * (nbreJoursRetard / totalJoursAnnee) * (tauxBCE + points);
