const action = require("../models").action;
const models = require("../models")
const creancier = require("../models").creancier;
const debiteur = require("../models").debiteur;

module.exports = {
  list(req, res) {
    return action
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return action
      .create({
        nom_action: req.body.nom_action,
        date: req.body.date,
        type: req.body.type,
        ville_tc_requete: req.body.ville_tc_requete,
        ville_tc_opposition: req.body.ville_tc_opposition,
        produits: req.body.produits,
        services: req.body.services,
        calcul_acomptes_payes: req.body.calcul_acomptes_payes,
        calcul_solde_du: req.body.calcul_solde_du,
        calcul_total_creance: req.body.calcul_total_creance,
        calcul_total_interets: req.body.calcul_total_interets,
        frais_recouvrement: req.body.frais_recouvrement,
        honoraires: req.body.honoraires,
        somme_totale_ttc: req.body.somme_totale_ttc,
        somme_totale_ht: req.body.somme_totale_ht,
        date_mise_en_demeure: req.body.date_mise_en_demeure,
        active: req.body.active
      })
      .then(action => {
        creancier
          .findOne({ where: { id: req.body.creancierId } })
          .then(creancier => creancier.addAction(action));
        debiteur
          .findOne({ where: { id: req.body.debiteurId } })
          .then(debiteur => debiteur.addAction(action));
        res.status(201).send(action);
      })
      .catch(error => res.status(400).send(error));
  },
  get(req, res){
    return action
    .findOne({ 
      where: { id: req.params.actionId},
      include: [{
        model : models.facture,
      }]
    })
    .then(actions => res.status(200).send(actions))
  },
  update(req, res) {
    return action
      .findOne({ where: { id: req.params.actionId } })
      .then(action => {
        if (!action) return res.status(404).send("L'action n'existe pas.");
        return action
          .update({
            nom_action: req.body.nom_action || action.nom_action,
            date: req.body.date || action.date,
            type: req.body.type || action.type,
            ville_tc_requete:
              req.body.ville_tc_requete || action.ville_tc_requete,
            ville_tc_opposition:
              req.body.ville_tc_opposition || action.ville_tc_opposition,
            produits: req.body.produits || action.produits,
            services: req.body.services || action.services,
            calcul_acomptes_payes:
              req.body.calcul_acomptes_payes || action.calcul_acomptes_payes,
            calcul_solde_du: req.body.calcul_solde_du || action.calcul_solde_du,
            calcul_total_creance:
              req.body.calcul_total_creance || action.calcul_total_creance,
            calcul_total_interets:
              req.body.calcul_total_interets || action.calcul_total_interets,
            frais_recouvrement:
              req.body.frais_recouvrement || action.frais_recouvrement,
            honoraires: req.body.honoraires || action.honoraires,
            somme_totale_ttc:
              req.body.somme_totale_ttc || action.somme_totale_ttc,
            somme_totale_ht: req.body.somme_totale_ht || action.somme_totale_ht,
            date_mise_en_demeure:
              req.body.date_mise_en_demeure || action.date_mise_en_demeure,
            active: req.body.active || action.active
          })
          .then(action => res.status(200).send(action))
          .catch(error => res.status(400).send(error));
      });
  },
  destroy(req, res) {
    return action
      .findOne({
        where: { id: req.params.actionId }
      })
      .then(action => {
        if (!action) {
          res.status(400).send("L'action n'existe pas.");
        }
        return action
          .destroy()
          .then(action => {
            res.status(200).send("L'action a été supprimée !");
          })
          .catch(error => {
            res
              .status(400)
              .send(
                `Erreur : il n'est pas possible de supprimer l'action'. - ${error}`
              );
          });
      });
  }
};
