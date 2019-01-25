const partiel = require("../models").partiel;
const facture = require("../models").facture;

module.exports = {
  list(req, res) {
    return partiel
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return partiel
      .create({
        num_partiel: req.body.num_partiel,
        date_partiel: req.body.date_partiel,
        montant_ht: req.body.montant_ht,
        montant_ttc: req.body.montant_ttc,
        active: req.body.active
      })
      .then(partiel => {
        facture
          .findOne({ where: { id: req.body.factureId } })
          .then(facture =>
            facture.addPartiel(partiel).then(() => res.status(201).send())
          );
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return partiel
      .findOne({ where: { id: req.params.partielId } })
      .then(partiel => {
        if (!partiel)
          return res.status(404).send("Le paiement partiel n'existe pas.");
        return partiel
          .update({
            num_partiel: req.body.num_partiel || partiel.num_partiel,
            date_partiel: req.body.date_partiel || partiel.date_partiel,
            montant_ht: req.body.montant_ht || partiel.montant_ht,
            montant_ttc: req.body.montant_ttc || partiel.montant_ttc,
            active: req.body.active || partiel.active
          })
          .then(partiel => res.status(200).send(partiel))
          .catch(error => res.status(400).send(error));
      });
  },
  destroy(req, res) {
    return partiel
      .findOne({
        where: { id: req.params.partielId }
      })
      .then(partiel => {
        if (!partiel) {
          res.status(400).send("Le paiement partiel n'existe pas.");
        }
        return partiel
          .destroy()
          .then(partiel => {
            res.status(200).send("Le paiement partiel a été supprimé !");
          })
          .catch(error => {
            res
              .status(400)
              .send(
                `Erreur : il n'est pas possible de supprimer le paiement partiel'. - ${error}`
              );
          });
      });
  }
};
