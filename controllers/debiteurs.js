const debiteur = require("../models").debiteur;

module.exports = {
  list(req, res) {
    return debiteur
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return debiteur
      .create({
        denomination_sociale: req.body.denomination_sociale,
        forme_juridique: req.body.forme_juridique,
        nationalite_societe: req.body.nationalite_societe,
        adresse_siege: req.body.adresse_siege,
        code_postal_siege: req.body.code_postal_siege,
        ville_siege: req.body.ville_siege,
        pays_siege: req.body.pays_siege,
        ville_rcs: req.body.ville_rcs,
        num_rcs: req.body.num_rcs,
        nom: req.body.nom,
        prenom: req.body.prenom,
        civilite: req.body.civilite,
        fonction: req.body.fonction,
        active: req.body.active
      })
      .then(debiteur => res.status(201).send(debiteur))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return debiteur
      .findOne({
        where: { id: req.params.debiteurId }
      })
      .then(debiteur => {
        if (!debiteur) return res.status(404).send("Le débiteur n'existe pas.");
        return debiteur
          .update({
            denomination_sociale:
              req.body.denomination_sociale || debiteur.denomination_sociale,
            forme_juridique:
              req.body.forme_juridique || debiteur.forme_juridique,
            nationalite_societe:
              req.body.nationalite_societe || debiteur.nationalite_societe,
            adresse_siege: req.body.adresse_siege || debiteur.adresse_siege,
            code_postal_siege:
              req.body.code_postal_siege || debiteur.code_postal_siege,
            ville_siege: req.body.ville_siege || debiteur.ville_siege,
            pays_siege: req.body.pays_siege || debiteur.pays_siege,
            ville_rcs: req.body.ville_rcs || debiteur.ville_rcs,
            num_rcs: req.body.num_rcs || debiteur.num_rcs,
            nom: req.body.nom || debiteur.nom,
            prenom: req.body.prenom || debiteur.prenom,
            civilite: req.body.civilite || debiteur.civilite,
            fonction: req.body.fonction || debiteur.fonction,
            active: req.body.active || debiteur.active
          })
          .then(debiteur => res.status(200).send(debiteur))
          .catch(error => res.status(400).send(error));
      });
  },
  destroy(req, res) {
    return debiteur
      .findOne({
        where: { id: req.params.debiteurId }
      })
      .then(debiteur => {
        if (!debiteur)
          return res.status(404).send("Le créancier n'existe pas.");
        return debiteur
          .destroy()
          .then(debiteur => {
            res.status(200).send("Le débiteur a été supprimé !");
          })
          .catch(error => {
            res
              .status(400)
              .send(
                `Erreur : il n'est pas possible de supprimer le débiteur.  - ${error}`
              );
          });
      });
  }
};
