const creancier = require("../models").creancier;

module.exports = {
  list(req, res) {
    return creancier
      .findAll()
      .then(list => res.status(200).send(list))
      .catch(error => res.status(404).send(error));
  },
  create(req, res) {
    return creancier
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
        num_CCIAA: req.body.num_CCIAA,
        num_reg_soc: req.body.num_reg_soc,
        num_cod_fisc_tva: req.body.num_cod_fisc_tva,
        capital_social: req.bodycapital_social,
        nom: req.body.nom,
        prenom: req.body.prenom,
        civilite: req.body.civilite,
        fonction: req.body.fonction,
        active: req.body.active
      })
      .then(creancier => res.status(201).send(creancier))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return creancier
      .findOne({ where: { id: req.params.creancierId } })
      .then(creancier => {
        if (!creancier)
          return res.status(404).send("Oh la la ! Creancier not found !");
        return creancier
          .update({
            denomination_sociale:
              req.body.denomination_sociale || creancier.denomination_sociale,
            forme_juridique:
              req.body.forme_juridique || creancier.forme_juridique,
            nationalite_societe:
              req.body.nationalite_societe || creancier.nationalite_societe,
            adresse_siege: req.body.adresse_siege || creancier.adresse_siege,
            code_postal_siege:
              req.body.code_postal_siege || creancier.code_postal_siege,
            ville_siege: req.body.ville_siege || creancier.ville_siege,
            pays_siege: req.body.pays_siege || creancier.pays_siege,
            ville_rcs: req.body.ville_rcs || creancier.ville_rcs,
            num_rcs: req.body.num_rcs || creancier.num_rcs,
            num_CCIAA: req.body.num_CCIAA || creancier.num_CCIAA,
            num_reg_soc: req.body.num_reg_soc || creancier.num_reg_soc,
            num_cod_fisc_tva:
              req.body.num_cod_fisc_tva || creancier.num_cod_fisc_tva,
            capital_social: req.bodycapital_social || creancier.capital_social,
            nom: req.body.nom || creancier.nom,
            prenom: req.body.prenom || creancier.prenom,
            civilite: req.body.civilite || creancier.civilite,
            fonction: req.body.fonction || creancier.fonction,
            active: req.body.active || creancier.active
          })
          .then(creancier => res.status(200).send(creancier))
          .catch(error => res.status(400).send(error));
      });
  },
  destroy(req, res) {
    return creancier
      .findOne({
        where: { id: req.params.creancierId }
      })
      .then(creancier => {
        if (!creancier) {
          res
            .status(400)
            .send(
              "Mein gott ! Das ist ein gross problem ! Creancier nicht bin ein Berliner"
            );
        }
        return creancier
          .destroy()
          .then(creancier => {
            res.status(200).send("Success: Das problem ist terminated !");
          })
          .catch(error => {
            res.status(400).send(`Error: Ich bin ein kartoffeln - ${error}`);
          });
      });
  }
};
