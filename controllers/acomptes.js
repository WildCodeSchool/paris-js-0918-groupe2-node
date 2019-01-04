const acompte = require("../models").acompte;
const facture = require("../models").facture;

module.exports = {
  list(req, res) {
    return acompte
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return acompte
      .create({
        num_acompte: req.body.num_acompte,
        date_acompte: req.body.date_acompte,
        montant_ht: req.body.montant_ht,
        montant_ttc: req.body.montant_ttc,
        active: req.body.active
      })
      .then(acompte => {
        facture
          .findOne({ where: { id: req.body.factureId } })
          .then(facture =>
            facture.addAcompte(acompte).then(() => res.status(201).send())
          );
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return acompte
      .findOne({ where: { id: req.params.acompteId } })
      .then(acompte => {
        if (!acompte) return res.status(404).send("L'acompte n'existe pas.");
        return acompte
          .update({
            num_acompte: req.body.num_acompte || acompte.num_acompte,
            date_acompte: req.body.date_acompte || acompte.date_acompte,
            montant_ht: req.body.montant_ht || acompte.montant_ht,
            montant_ttc: req.body.montant_ttc || acompte.montant_ttc,
            active: req.body.active || acompte.active
          })
          .then(acompte => res.status(200).send(acompte))
          .catch(error => res.status(400).send(error));
      });
  },
  destroy(req, res) {
    return acompte
      .findOne({
        where: { id: req.params.acompteId }
      })
      .then(acompte => {
        if (!acompte) {
          res.status(400).send("L'acompte n'existe pas.");
        }
        return acompte
          .destroy()
          .then(acompte => {
            res.status(200).send("L'acompte a été supprimé !");
          })
          .catch(error => {
            res
              .status(400)
              .send(
                `Erreur : il n'est pas possible de supprimer l'acompte'. - ${error}`
              );
          });
      });
  }
};
