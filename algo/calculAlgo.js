await fetch("localhost:3000/api/factures");
await (data => {
  data.montant_ttc;
});
let montant = data.montant_ttc;

const jours = DateTime(fhfuIDFH) - DateTime(uhugyg);
const nbjours = jours / req.body.date;
const tauxBCE = taux + req.body.taux;

const calculAlgo = () => {
  montant * tauxBCE * nbjours;
};
