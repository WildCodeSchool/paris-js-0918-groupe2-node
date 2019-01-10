const moment = require("moment");
const fetch = require("node-fetch");
const axios = require("axios");
const http = require("http");
moment().format();

const facture = {
  montant_ttc: 10268,
  echeance_facture: "12/01/2012"
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

const dateFinCalculInterets = "12/12/2012";
const points = 10;

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
  let depart_echeance = moment(startDate, "DD/MM/YYYY", true).add(1, "days");
  // add 1 day parce que date de calcul des interets commence le lendemain de la date d'echeance
  let fin_echeance = moment(endDate, "DD/MM/YYYY", true);

  let nbreAnneesDifferences = fin_echeance.diff(depart_echeance, "year");
  let nbreJoursInterets = fin_echeance.diff(depart_echeance, "days") + 1;
  // + 1 parce que le .diff de moments ne prends pas en compte le jour de depart dans le calcul entre deux dates

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
  AnneesAvecJoursParSemestres.push({
    nbreJoursInterets: nbreJoursInterets,
    dateDepart: depart_echeance,
    dateFin: fin_echeance
  });
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

const getCalculInteretsParSemestre = async (
  totalCreance,
  nbreJoursInterets,
  totalJoursAnnee,
  annee,
  semestre,
  points,
  debut,
  fin
) => {
  const calculInterets = [];
  let mySemestre;
  if (semestre === 1) {
    mySemestre = "-01-01";
  } else if (semestre === 2) {
    mySemestre = "-07-01";
  }

  const BCErate = await getBCErates(
    `${annee}${mySemestre}`,
    `${annee}${mySemestre}`
  ).then(res => {
    console.log("Tx Interet: " + res);
    let jourSurAnnee = nbreJoursInterets / totalJoursAnnee;
    let tauxBCEEtPoint = (res + points) / 100;
    let calcul_interets_periode = totalCreance * jourSurAnnee * tauxBCEEtPoint;
    calculInterets.push({
      date_debut: debut.format("DD/MM/YYYY"),
      date_fin: fin.format("DD/MM/YYYY"),
      nbre_jours_comptabilises: nbreJoursInterets,
      interets_periode: calcul_interets_periode
    });
  });
  console.log(calculInterets);
};

const getCalculInteretsParAnnee = async (
  totalCreance,
  nbreJoursInterets,
  totalJoursAnnee,
  annee,
  semestre,
  points,
  debut,
  fin
) => {
  const calculInterets = [];
  let mySemestre;
  if (semestre === 1) {
    mySemestre = "-01-01";
  } else if (semestre === 2) {
    mySemestre = "-07-01";
  }

  const BCErate = await getBCErates(
    `${annee}${mySemestre}`,
    `${annee}${mySemestre}`
  ).then(res => {
    let jourSurAnnee = (nbreJoursInterets + 1) / totalJoursAnnee;
    let tauxBCEEtPoint = (res + points) / 100;
    let calcul_interets_periode = totalCreance * jourSurAnnee * tauxBCEEtPoint;
    calculInterets.push({
      date_debut: debut.format("DD/MM/YYYY"),
      date_fin: fin.format("DD/MM/YYYY"),
      nbre_jours_comptabilises: nbreJoursInterets + 1,
      interets_periode: calcul_interets_periode,
      taux_interet_applique: res
    });
  });
  console.log(calculInterets);
};

getCalculInteretsTotal = (debut, fin) => {
  let anneeDebut = parseInt(debut.format("YYYY"));
  let anneeFin = parseInt(fin.format("YYYY"));
  // si creance sur la meme annee
  if (anneeDebut === anneeFin) {
    let finSemestre1 = moment(`30/06/${anneeDebut}`, "DD/MM/YYYY", true);
    let finSemestre2 = moment(`31/12/${anneeDebut}`, "DD/MM/YYYY", true);
    let debutSemestre2 = moment(`01/07/${anneeDebut}`, "DD/MM/YYYY", true);
    let nbreJoursSemestre1 = finSemestre1.diff(debut, "days");
    let nbreJoursSemestre2 = fin.diff(debutSemestre2, "days");
    let moisDebut = parseInt(debut.format("MM"));
    let moisFin = parseInt(fin.format("MM"));
    let semestre = 0;
    // si creance sur un seul semestre
    if (moisDebut < 7 && moisFin < 7) {
      semestre = 1;
      getCalculInteretsParSemestre(
        totalCreance,
        nbreJoursInterets[1].nbreJoursInterets,
        nbreJoursInterets[0].nbreJourAnnee,
        anneeDebut,
        semestre,
        points,
        debut,
        fin
      );
    } else if (moisDebut > 6 && moisFin > 6) {
      semestre = 2;
      getCalculInteretsParSemestre(
        totalCreance,
        nbreJoursInterets[1].nbreJoursInterets,
        nbreJoursInterets[0].nbreJourAnnee,
        anneeDebut,
        semestre,
        points,
        debut,
        fin
      );
    } else if (moisDebut < 7 && moisFin > 6) {
      semestre = 1;
      getCalculInteretsParAnnee(
        totalCreance,
        nbreJoursSemestre1,
        nbreJoursInterets[0].nbreJourAnnee,
        nbreJoursInterets[0].annee,
        semestre,
        points,
        debut,
        finSemestre1
      );
      semestre = 2;
      getCalculInteretsParAnnee(
        totalCreance,
        nbreJoursSemestre2,
        nbreJoursInterets[0].nbreJourAnnee,
        nbreJoursInterets[0].annee,
        semestre,
        points,
        debutSemestre2,
        fin
      );
    }
  }
};

getCalculInteretsTotal(
  nbreJoursInterets[1].dateDepart,
  nbreJoursInterets[1].dateFin
);

// let totalFacture = getTotalCreance(facture, mesAcomptes, mesAvoirs);

// < 1 semestre
// totalFacture * (nbreJoursRetard / totalJoursAnnee) * (tauxBCE + points);
