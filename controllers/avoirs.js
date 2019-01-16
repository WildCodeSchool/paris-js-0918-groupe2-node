const avoir = require("../models").avoir;
const facture = require("../models").facture;

module.exports = {
  list(req, res) {
    return avoir
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return avoir
      .create({
        num_avoir: req.body.num_avoir,
        date_avoir: req.body.date_avoir,
        montant_ht: req.body.montant_ht,
        montant_ttc: req.body.montant_ttc,
        active: req.body.active
      })
      .then(avoir => {
        facture
          .findOne({ where: { id: req.body.factureId } })
          .then(facture =>
            facture.addAvoir(avoir).then(() => res.status(201).send())
          );
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return avoir.findOne({ where: { id: req.params.avoirId } }).then(avoir => {
      if (!avoir) return res.status(404).send("L'avoir n'existe pas.");
      return avoir
        .update({
          num_avoir: req.body.num_avoir || avoir.num_avoir,
          date_avoir: req.body.date_avoir || avoir.date_avoir,
          montant_ht: req.body.montant_ht || avoir.montant_ht,
          montant_ttc: req.body.montant_ttc || avoir.montant_ttc,
          active: req.body.active || avoir.active
        })
        .then(avoir => res.status(200).send(avoir))
        .catch(error => res.status(400).send(error));
    });
  },
  destroy(req, res) {
    return avoir
      .findOne({
        where: { id: req.params.avoirId }
      })
      .then(avoir => {
        if (!avoir) {
          res.status(400).send("L'avoir n'existe pas.");
        }
        return avoir
          .destroy()
          .then(avoir => {
            res.status(200).send("L'avoir a été supprimé !");
          })
          .catch(error => {
            res
              .status(400)
              .send(
                `Erreur : il n'est pas possible de supprimer l'avoir'. - ${error}`
              );
          });
      });
  }
};
