const facture = require("../models").facture;
const action = require("../models").action;
const models = require("../models");

module.exports = {
  list(req, res) {
    return facture
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return facture
      .create({
        num_commande: req.body.num_commande,
        num_confirmation_commande: req.body.num_confirmation_commande,
        num_document_transport: req.body.num_document_transport,
        num_facture: req.body.num_facture,
        date_facture: req.body.date_facture,
        montant_ht: req.body.montant_ht,
        montant_ttc: req.body.montant_ttc,
        echeance_facture: req.body.echeance_facture,
        taux_applicable: req.body.taux_applicable,
        intérets_capitalises: req.body.intérets_capitalises,
        paiement_echeance: req.body.paiement_echeance,
        paiement_livraison: req.body.paiement_livraison,
        active: req.body.active
      })
      .then(facture => {
        action
          .findOne({ where: { id: req.body.actionId } })
          .then(action =>
            action.addFacture(facture).then(() => res.status(201).send())
          );
      })
      .catch(error => res.status(400).send(error));
  },
  get(req, res) {
    return facture
      .findOne({
        where: { id: req.params.factureId },
        include: [
          {
            model: models.acompte
          },
          { model: models.avoir },
          { model: models.partiel }
        ]
      })
      .then(factures => res.status(200).send(factures));
  },
  update(req, res) {
    return facture
      .findOne({ where: { id: req.params.factureId } })
      .then(facture => {
        if (!facture) return res.status(404).send("La facture n'existe pas.");
        return facture
          .update({
            num_commande: req.body.num_commande || facture.num_commande,
            num_confirmation_commande:
              req.body.num_confirmation_commande ||
              facture.num_confirmation_commande,
            num_document_transport:
              req.body.num_document_transport || facture.num_document_transport,
            num_facture: req.body.num_facture || facture.num_facture,
            date_facture: req.body.date_facture || facture.date_facture,
            montant_ht: req.body.montant_ht || facture.montant_ht,
            montant_ttc: req.body.montant_ttc || facture.montant_ttc,
            echeance_facture:
              req.body.echeance_facture || facture.echeance_facture,
            taux_applicable:
              req.body.taux_applicable || facture.taux_applicable,
            intérets_capitalises:
              req.body.intérets_capitalises || facture.intérets_capitalises,
            paiement_echeance:
              req.body.paiement_echeance !== undefined
                ? req.body.paiement_echeance
                : facture.paiement_echeance,
            paiement_livraison:
              req.body.paiement_livraison !== undefined
                ? req.body.paiement_livraison
                : facture.paiement_livraison,
            active: req.body.active || facture.active
          })
          .then(facture => res.status(200).send(facture))
          .catch(error => res.status(400).send(error));
      });
  },
  destroy(req, res) {
    return facture
      .findOne({
        where: { id: req.params.factureId }
      })
      .then(facture => {
        if (!facture) {
          res.status(400).send("La facture n'existe pas.");
        }
        return facture
          .destroy()
          .then(facture => {
            res.status(200).send("La facture a été supprimée !");
          })
          .catch(error => {
            res
              .status(400)
              .send(
                `Erreur : il n'est pas possible de supprimer la facture. - ${error}`
              );
          });
      });
  }
};
